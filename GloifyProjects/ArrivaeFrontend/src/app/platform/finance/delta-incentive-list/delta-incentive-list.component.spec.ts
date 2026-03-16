import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaIncentiveListComponent } from './delta-incentive-list.component';

describe('DeltaIncentiveListComponent', () => {
  let component: DeltaIncentiveListComponent;
  let fixture: ComponentFixture<DeltaIncentiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaIncentiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaIncentiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
