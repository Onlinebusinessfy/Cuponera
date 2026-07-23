import { Component, inject } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, 
  IonSegmentContent, IonSegmentView, IonLabel, IonGrid, IonCardTitle, 
  IonCardSubtitle, IonCardHeader, IonImg, IonRow, IonCol, IonCard, 
  IonButtons, IonButton, IonIcon 
} from '@ionic/angular/standalone';
import { NgTemplateOutlet } from '@angular/common';

import { Coupon, ICouponData } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { ToastService } from 'src/app/toast.service';

import { 
  CapacitorBarcodeScanner, 
  CapacitorBarcodeScannerScanResult, 
  CapacitorBarcodeScannerTypeHint 
} from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, 
    IonSegmentContent, IonSegmentView, IonLabel, FilterCouponCategoryPipe, 
    IonGrid, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, 
    IonRow, IonCol, IonCard, IonButtons, IonButton, IonIcon, NgTemplateOutlet
  ],
})
export class Tab1Page {
  private couponService: CouponService = inject(CouponService);
  private toastService: ToastService = inject(ToastService);

  coupons: Coupon[] = [];

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log('Coupons:', this.coupons);
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }

  startCamera() {
    CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE
    })
    .then((resultBarcode: CapacitorBarcodeScannerScanResult) => {
      console.log(resultBarcode);
      if (resultBarcode.ScanResult) {
        try {
          const couponData: ICouponData = JSON.parse(resultBarcode.ScanResult);
          const coupon = new Coupon(couponData);

          if (coupon.isValid()) {
            const couponExist = this.coupons.some((c: Coupon) => c.isEqual(coupon));

            if (!couponExist) {
              this.coupons = [...this.coupons, coupon];
              this.couponService.saveCoupons(this.coupons);
              this.toastService.showToast("Cupon agregado");
            } else {
              this.toastService.showToast("El cupon ya existe");
            }
          } else {
            this.toastService.showToast("El cupon es Invalido");
          }
        } catch (error) {
          console.error(error);
          this.toastService.showToast("Error al procesar el cupon");
        }
      }
    });
  }
}