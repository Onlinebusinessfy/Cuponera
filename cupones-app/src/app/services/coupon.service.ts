import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly DDR_KEY:string = "ddr_key_coupons";

  async getCoupons(){

    const couponsData: ICouponData[] | null = await this.recoverCoupons();

    if(couponsData){
      return this.processCoupons(couponsData);
    }

    return fetch('./assets/data/coupons.json')
    .then( async (res: Response)=>{
      const couponData: ICouponData[] = await res.json();
      const coupons: Coupon[] = this.processCoupons(couponData);
      coupons.forEach(coupon => coupon.active = false );
      return coupons;
    })
    .catch(err => {
      return [];
    })
  }
  
  processCoupons(couponsData: ICouponData[]){
    const coupons: Coupon[] = [];
    for (const couponData of couponsData) {
      const coupon = new Coupon(couponData);
      coupons.push(coupon);
    }
    return coupons;
  }

  syncScannedCoupons(coupons: Coupon[], scannedPayload: { coupons?: Array<{ idProduct: number }> }): Coupon[] {
    const scannedIds = new Set(
      (scannedPayload.coupons ?? []).map((coupon) => Number(coupon.idProduct))
    );

    return coupons.map((coupon) => {
      const syncedCoupon = new Coupon(coupon.toCouponData());
      syncedCoupon.active = scannedIds.has(coupon.idProduct);
      return syncedCoupon;
    });
  }

  async saveCoupons(coupons: Coupon[]){
    const couponsData: ICouponData[] = coupons
    .map( (coupon:Coupon) => coupon.toCouponData());

    return Preferences.set({
      key:this.DDR_KEY,
      value: JSON.stringify(couponsData)
    });
  }

  async recoverCoupons(){
    const couponsPreferences = await Preferences.get({ key: this.DDR_KEY });
    if(couponsPreferences.value){
      return JSON.parse(couponsPreferences.value) as ICouponData[];
    }
    return null;
  }
}