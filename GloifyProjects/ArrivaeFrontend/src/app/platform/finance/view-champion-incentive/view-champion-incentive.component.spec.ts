import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChampionIncentiveComponent } from './view-champion-incentive.component';

describe('ViewChampionIncentiveComponent', () => {
  let component: ViewChampionIncentiveComponent;
  let fixture: ComponentFixture<ViewChampionIncentiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChampionIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChampionIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
