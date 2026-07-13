import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonLabel, IonGrid, IonCardTitle, IonCardSubtitle, IonCardHeader, IonImg, IonRow, IonCol, IonCard} from '@ionic/angular/standalone';
import { Coupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import { FilterCouponCategoryPipe } from 'src/app/pipes/filter-coupon-category-pipe';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, 
    IonLabel, FilterCouponCategoryPipe, JsonPipe, IonGrid, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg, IonRow, IonCol, IonCard],
})
export class Tab1Page {
  private couponService: CouponService = inject(CouponService);

  coupons:Coupon[] = [];

  async ionViewWillEnter() {
    this.coupons = await this.couponService.getCoupons();
    console.log('Coupons:', this.coupons);
  }
}
