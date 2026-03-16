import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoterMngtComponent } from './promoter-mngt.component';

describe('PromoterMngtComponent', () => {
  let component: PromoterMngtComponent;
  let fixture: ComponentFixture<PromoterMngtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoterMngtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoterMngtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
