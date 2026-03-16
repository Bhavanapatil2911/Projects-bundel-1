import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerreviewComponent } from './customerreview.component';

describe('CustomerreviewComponent', () => {
  let component: CustomerreviewComponent;
  let fixture: ComponentFixture<CustomerreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
