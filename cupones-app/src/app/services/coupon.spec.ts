import { TestBed } from '@angular/core/testing';

import { Coupon } from './coupon.service';

describe('CouponService', () => {
  let service: CouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Coupon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
