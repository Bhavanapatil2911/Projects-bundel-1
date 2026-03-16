import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashbaordComponent } from './vendor-dashbaord.component';

describe('VendorDashbaordComponent', () => {
  let component: VendorDashbaordComponent;
  let fixture: ComponentFixture<VendorDashbaordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDashbaordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
