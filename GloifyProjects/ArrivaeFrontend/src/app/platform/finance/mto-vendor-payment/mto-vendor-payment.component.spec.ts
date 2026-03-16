import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoVendorPaymentComponent } from './mto-vendor-payment.component';

describe('MtoVendorPaymentComponent', () => {
  let component: MtoVendorPaymentComponent;
  let fixture: ComponentFixture<MtoVendorPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtoVendorPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtoVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
