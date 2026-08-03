import { Component, inject } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonSegment, 
  IonSegmentButton, 
  IonSegmentContent, 
  IonSegmentView, 
  IonLabel, 
  IonGrid, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardHeader, 
  IonImg, 
  IonRow, 
  IonCol, 
  IonCard,
  IonIcon,
  IonButtons,
  IonButton,
  IonText
} from '@ionic/angular/standalone';
import { Coupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import { ToastService } from 'src/app/services/toast.service';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { NgTemplateOutlet } from '@angular/common';
import { addIcons } from 'ionicons';
import { cameraOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonSegment, 
    IonSegmentButton, 
    IonSegmentContent, 
    IonSegmentView,
    IonLabel, 
    FilterCouponCategoryPipe, 
    IonGrid, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonImg, 
    IonRow, 
    IonCol, 
    IonCard,
    NgTemplateOutlet, 
    IonIcon,
    IonButtons,
    IonButton,
    IonText
  ]
})
export class Tab1Page {
  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);

  coupons: Coupon[] = [];

  constructor() {
    addIcons({ cameraOutline });
  }

  async ionViewWillEnter() {
    try {
      this.coupons = await this.couponService.getCoupons();
      console.log('Coupons cargados:', this.coupons.length);
    } catch (error) {
      console.error('Error cargando cupones:', error);
      this.toastService.showError('Error al cargar los cupones');
    }
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }

  async startCamera() {
    try {
      console.log('Iniciando escaner...');
      
      const permission = await BarcodeScanner.checkPermission({ force: true });
      
      if (!permission.granted) {
        this.toastService.showError('Permiso de camara denegado');
        return;
      }

      this.toastService.showInfo('Escanea un codigo QR');

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        console.log('Codigo escaneado:', result.content);
        
        try {
          const scannedId = parseInt(result.content);
          
          if (isNaN(scannedId)) {
            this.toastService.showError('Codigo QR invalido');
            return;
          }

          const existingCoupon = this.coupons.find(c => c.idProduct === scannedId);
          
          if (existingCoupon) {
            existingCoupon.active = true;
            await this.couponService.saveCoupons(this.coupons);
            this.toastService.showSuccess('Cupon ' + existingCoupon.name + ' activado');
          } else {
            this.toastService.showError('Cupon no encontrado');
          }
          
        } catch (error) {
          console.error('Error procesando QR:', error);
          this.toastService.showError('Error al procesar el codigo');
        }
      } else {
        this.toastService.showWarning('Escaneo cancelado');
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      this.toastService.showError('Error al escanear el codigo');
    }
  }

  getActiveCouponsCount(): number {
    return this.coupons.filter(c => c.active).length;
  }
}