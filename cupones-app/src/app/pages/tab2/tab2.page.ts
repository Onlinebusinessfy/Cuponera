import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/angular/standalone';
import { Coupon } from 'src/app/models/coupon.model';
import { CouponService } from 'src/app/services/coupon.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg],
})
export class Tab2Page {
  private couponService: CouponService = inject(CouponService);

  activeCoupons: Coupon[] = [];
  qrCodeImage = '';

  async ionViewWillEnter() {
    const coupons = await this.couponService.getCoupons();
    this.activeCoupons = coupons.filter((coupon) => coupon.active);
    await this.updateQrCode();
  }

  async updateQrCode() {
    this.qrCodeImage = await QRCode.toDataURL(this.buildQrPayload());
  }

  buildQrPayload(): string {
    const payload = {
      coupons: this.activeCoupons.map((coupon) => ({
        idProduct: coupon.idProduct,
        name: coupon.name,
        category: coupon.category,
        discount: coupon.discount,
      })),
    };

    return JSON.stringify(payload);
  }
}
