import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpoMaintenanceComponent } from './vendorpo-maintenance.component';

describe('VendorpoMaintenanceComponent', () => {
  let component: VendorpoMaintenanceComponent;
  let fixture: ComponentFixture<VendorpoMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorpoMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorpoMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
