import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsDashboardComponent } from './ops-dashboard.component';

describe('OpsDashboardComponent', () => {
  let component: OpsDashboardComponent;
  let fixture: ComponentFixture<OpsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
