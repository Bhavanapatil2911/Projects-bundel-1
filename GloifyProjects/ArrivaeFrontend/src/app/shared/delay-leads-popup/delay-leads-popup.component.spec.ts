import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayLeadsPopupComponent } from './delay-leads-popup.component';

describe('DelayLeadsPopupComponent', () => {
  let component: DelayLeadsPopupComponent;
  let fixture: ComponentFixture<DelayLeadsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelayLeadsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelayLeadsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
