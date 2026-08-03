import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import QRCode from 'qrcode';
import { Coupon } from '../../models/coupon.model';
import { CouponService } from '../../services/coupon.service';
import { ScreenBrightness, GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonText
  ]
})
export class Tab2Page implements AfterViewInit {
  @ViewChild('qrCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  
  private couponService: CouponService = inject(CouponService);
  private platform: Platform = inject(Platform);
  QRCode: string = '';
  private currentBrightness!: GetBrightnessReturnValue;
  private qrGenerated: boolean = false;

  constructor() { }

  ngAfterViewInit() {
    this.generateQR();
  }

  async ionViewWillEnter() {
    if (!this.platform.is('desktop')) {
      try {
        this.currentBrightness = await ScreenBrightness.getBrightness();
        this.setMaxBrightness();
        if (this.platform.is('ios')) {
          App.addListener('appStateChange', (state) => {
            if (state.isActive)
              this.setMaxBrightness();
            else
              this.restoreBrightness();
          });
        }
      } catch (err) {
        console.log('Brillo no disponible en este entorno');
      }
    }

    try {
      const coupons: Coupon[] = await this.couponService.getCoupons();
      const couponsActive: Coupon[] = coupons.filter((coupon: Coupon) => coupon.active);
      
      if (couponsActive.length > 0) {
        this.QRCode = couponsActive[0].idProduct.toString();
      } else {
        this.QRCode = '';
      }
      
      console.log('QR Code generado:', this.QRCode);
      
      setTimeout(() => {
        this.generateQR();
      }, 100);
      
    } catch (error) {
      console.error('Error cargando cupones:', error);
      this.QRCode = '';
    }
  }

  generateQR() {
    if (this.canvas && this.QRCode && this.QRCode.length > 0) {
      QRCode.toCanvas(
        this.canvas.nativeElement,
        this.QRCode,
        { 
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        },
        (error: any) => {
          if (error) {
            console.error('Error generando QR:', error);
          } else {
            console.log('QR generado con exito para:', this.QRCode);
            this.qrGenerated = true;
          }
        }
      );
    }
  }

  ionViewDidLeave() {
    if (!this.platform.is('desktop')) {
      try {
        this.restoreBrightness();
        App.removeAllListeners();
      } catch (err) {
        console.log('Brillo no disponible en este entorno');
      }
    }
  }

  setMaxBrightness() {
    ScreenBrightness.setBrightness({ brightness: 1 });
  }

  restoreBrightness() {
    ScreenBrightness.setBrightness({ brightness: this.currentBrightness.brightness });
  }
}