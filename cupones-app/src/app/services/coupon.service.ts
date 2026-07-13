import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  getCoupons(){
    return fetch('./assets/data/coupons.json')
    .then(async (res: Response) => {
      const couponsData: ICouponData[] = await res.json();
      const coupons: Coupon[] = this.processCoupon(couponsData)
      coupons.forEach(coupon => coupon.active = true)
      return coupons;
    })
    .catch(err => {
      return []
    })
  }
  
  processCoupon(couponsData: ICouponData[]){
    const coupons: Coupon[] = [];
    for (const couponData of couponsData) {
      const coupon = new Coupon(couponData);
      coupons.push(coupon);
    }
    return coupons;
  }
}
