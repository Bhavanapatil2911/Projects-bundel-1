import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePromoPackagesComponent } from './create-promo-packages.component';

describe('CreatePromoPackagesComponent', () => {
  let component: CreatePromoPackagesComponent;
  let fixture: ComponentFixture<CreatePromoPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePromoPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePromoPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
