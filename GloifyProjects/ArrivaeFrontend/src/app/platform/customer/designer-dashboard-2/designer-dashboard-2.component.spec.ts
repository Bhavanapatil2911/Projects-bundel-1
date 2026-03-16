import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerDashboard2Component } from './designer-dashboard-2.component';

describe('DesignerDashboard2Component', () => {
  let component: DesignerDashboard2Component;
  let fixture: ComponentFixture<DesignerDashboard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerDashboard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerDashboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
