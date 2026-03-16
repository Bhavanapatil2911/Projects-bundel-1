import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPoComponent } from './bulk-po.component';

describe('BulkPoComponent', () => {
  let component: BulkPoComponent;
  let fixture: ComponentFixture<BulkPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
