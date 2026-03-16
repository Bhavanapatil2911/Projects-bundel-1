import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BulkVendorPaymentComponent } from "./bulk-vendor-payment.component";

describe("BulkVendorPaymentComponent", () => {
  let component: BulkVendorPaymentComponent;
  let fixture: ComponentFixture<BulkVendorPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkVendorPaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkVendorPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
