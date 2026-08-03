import { Injectable } from '@angular/core';
import { Coupon, ICouponData } from '../models/coupon.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private readonly DDR_KEY: string = "ddr_key_coupons";

  async getCoupons(): Promise<Coupon[]> {
    const couponsData: ICouponData[] | null = await this.recoverCoupons();

    if (couponsData) {
      return this.processCoupons(couponsData);
    }

    try {
      const response = await fetch('./assets/data/coupons.json');
      const couponData: ICouponData[] = await response.json();
      const coupons: Coupon[] = this.processCoupons(couponData);
      coupons.forEach(coupon => coupon.active = false);
      await this.saveCoupons(coupons);
      return coupons;
    } catch (err) {
      console.error('Error cargando cupones:', err);
      return [];
    }
  }
  
  processCoupons(couponsData: ICouponData[]): Coupon[] {
    const coupons: Coupon[] = [];
    for (const couponData of couponsData) {
      const coupon = new Coupon(couponData);
      coupons.push(coupon);
    }
    return coupons;
  }

  async saveCoupons(coupons: Coupon[]): Promise<void> {
    const couponsData: ICouponData[] = coupons.map(
      (coupon: Coupon) => coupon.toCouponData()
    );

    await Preferences.set({
      key: this.DDR_KEY,
      value: JSON.stringify(couponsData)
    });
  }

  async recoverCoupons(): Promise<ICouponData[] | null> {
    const couponsPreferences = await Preferences.get({ key: this.DDR_KEY });
    if (couponsPreferences.value) {
      return JSON.parse(couponsPreferences.value) as ICouponData[];
    }
    return null;
  }

  async addCoupon(couponData: ICouponData): Promise<boolean> {
    try {
      const currentCoupons = await this.getCoupons();
      const exists = currentCoupons.some(c => c.idProduct === couponData.idProduct);
      if (exists) return false;

      const newCoupon = new Coupon(couponData);
      const updatedCoupons = [...currentCoupons, newCoupon];
      await this.saveCoupons(updatedCoupons);
      return true;
    } catch (error) {
      console.error('Error agregando cupon:', error);
      return false;
    }
  }

  async updateCoupon(coupon: Coupon): Promise<boolean> {
    try {
      const currentCoupons = await this.getCoupons();
      const index = currentCoupons.findIndex(c => c.idProduct === coupon.idProduct);
      if (index === -1) return false;

      currentCoupons[index] = coupon;
      await this.saveCoupons(currentCoupons);
      return true;
    } catch (error) {
      console.error('Error actualizando cupon:', error);
      return false;
    }
  }

  async deleteCoupon(idProduct: number): Promise<boolean> {
    try {
      const currentCoupons = await this.getCoupons();
      const updatedCoupons = currentCoupons.filter(c => c.idProduct !== idProduct);
      if (updatedCoupons.length === currentCoupons.length) return false;

      await this.saveCoupons(updatedCoupons);
      return true;
    } catch (error) {
      console.error('Error eliminando cupon:', error);
      return false;
    }
  }

  async getActiveCoupons(): Promise<Coupon[]> {
    const coupons = await this.getCoupons();
    return coupons.filter(c => c.active);
  }

  async getCouponsByCategory(category: string): Promise<Coupon[]> {
    const coupons = await this.getCoupons();
    return coupons.filter(c => c.category === category);
  }
}