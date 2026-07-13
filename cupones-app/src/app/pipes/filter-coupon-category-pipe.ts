import { Pipe, PipeTransform } from '@angular/core';
import { Coupon } from '../models/coupon.model';

@Pipe({
  name: 'filterCouponCategory'
})
export class FilterCouponCategoryPipe implements PipeTransform {

  transform(coupons: Coupon[], category: string): Coupon[] {
    return coupons.filter(coupon => coupon.category === category);
  }
}
