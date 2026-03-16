import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBulkApproveAmountComponent } from './update-bulk-approve-amount.component';

describe('UpdateBulkApproveAmountComponent', () => {
  let component: UpdateBulkApproveAmountComponent;
  let fixture: ComponentFixture<UpdateBulkApproveAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBulkApproveAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBulkApproveAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
