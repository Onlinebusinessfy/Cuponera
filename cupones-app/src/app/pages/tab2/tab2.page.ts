import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { Coupon } from '../../models/coupon.model';
import { CouponService } from '../../services/coupon.service';
import { ScreenBrightness, GetBrightnessReturnValue } from '@capacitor-community/screen-brightness';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText, QRCodeComponent]
})
export class Tab2Page {

  private couponService: CouponService = inject(CouponService);
  private platform: Platform = inject(Platform);
  QRCode!: string;
  private currentBrightness!: GetBrightnessReturnValue;

  constructor() { }

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
          })
        }
      } catch (err) {
        console.log('Brillo no disponible en este entorno');
      }
    }
    const coupons: Coupon[] = await this.couponService.getCoupons();
    const couponsActive: Coupon[] = coupons.filter((coupon: Coupon) => coupon.active);
    this.QRCode = couponsActive.length > 0 ? JSON.stringify(couponsActive) : '';
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