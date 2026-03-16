import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoPackagesComponent } from './promo-packages.component';

describe('PromoPackagesComponent', () => {
  let component: PromoPackagesComponent;
  let fixture: ComponentFixture<PromoPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
