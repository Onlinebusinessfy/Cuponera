import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a QR payload from the active coupons', async () => {
    component.activeCoupons = [
      {
        idProduct: 1,
        name: 'Galletas',
        category: 'candies',
        discount: 10,
        img: 'assets/img/galletas.jpg',
        active: true,
      } as any,
    ];

    const payload = component.buildQrPayload();

    expect(payload).toContain('"idProduct":1');
    expect(payload).toContain('"name":"Galletas"');
  });
});
