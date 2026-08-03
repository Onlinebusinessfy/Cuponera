import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonLabel, IonGrid, IonCardTitle, IonCardSubtitle, IonCardHeader, IonImg, IonRow, IonCol, IonCard, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Coupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { NgTemplateOutlet } from '@angular/common';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { addIcons } from 'ionicons';
import { scanOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView,
    IonLabel, FilterCouponCategoryPipe, IonGrid, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonRow, IonCol, IonCard,
    IonButton, IonButtons, IonIcon, NgTemplateOutlet],
})
export class Tab1Page {
  private couponService: CouponService = inject(CouponService);

  coupons:Coupon[] = [];

  constructor() {
    addIcons({ scanOutline });
  }

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log('Coupons:', this.coupons);
  }

  async startScan() {
    try {
      await BarcodeScanner.checkPermission({ force: true });
      await BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();
      if (!result.hasContent) {
        return;
      }

      const scannedPayload = JSON.parse(result.content) as { coupons?: Array<{ idProduct: number }> };
      this.coupons = this.couponService.syncScannedCoupons(this.coupons, scannedPayload);
      await this.couponService.saveCoupons(this.coupons);
    } catch (error) {
      console.error('Error scanning QR:', error);
    } finally {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    }
  }

  changeActive(coupon: Coupon){
    coupon.active = !coupon.active;
    this.couponService.saveCoupons(this.coupons);
  }
}