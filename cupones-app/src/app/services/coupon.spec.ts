import { TestBed } from '@angular/core/testing';

import { Coupon } from '../models/coupon.model';
import { CouponService } from './coupon.service';

describe('CouponService', () => {
  let service: CouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sync active coupons from a scanned QR payload', () => {
    const coupons = [
      new Coupon({ idProduct: 1, img: 'a', name: 'A', category: 'candies', discount: 10, active: false }),
      new Coupon({ idProduct: 2, img: 'b', name: 'B', category: 'candies', discount: 20, active: false }),
      new Coupon({ idProduct: 3, img: 'c', name: 'C', category: 'drinks', discount: 30, active: true }),
    ];

    const syncedCoupons = service.syncScannedCoupons(coupons, {
      coupons: [
        { idProduct: 1, name: 'A', category: 'candies', discount: 10 },
        { idProduct: 3, name: 'C', category: 'drinks', discount: 30 },
      ] as Array<{ idProduct: number; name: string; category: string; discount: number }>,
    });

    expect(syncedCoupons[0].active).toBeTrue();
    expect(syncedCoupons[1].active).toBeFalse();
    expect(syncedCoupons[2].active).toBeTrue();
  });
});
