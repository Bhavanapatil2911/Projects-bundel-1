import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmHundredDashboardComponent } from './pm-hundred-dashboard.component';

describe('PmHundredDashboardComponent', () => {
  let component: PmHundredDashboardComponent;
  let fixture: ComponentFixture<PmHundredDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmHundredDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmHundredDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
