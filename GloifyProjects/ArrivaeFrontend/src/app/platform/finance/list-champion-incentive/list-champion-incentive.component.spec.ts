import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChampionIncentiveComponent } from './list-champion-incentive.component';

describe('ListChampionIncentiveComponent', () => {
  let component: ListChampionIncentiveComponent;
  let fixture: ComponentFixture<ListChampionIncentiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChampionIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChampionIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
