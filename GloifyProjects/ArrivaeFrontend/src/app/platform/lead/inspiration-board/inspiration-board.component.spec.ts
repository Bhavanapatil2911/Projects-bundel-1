import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspirationBoardComponent } from './inspiration-board.component';

describe('InspirationBoardComponent', () => {
  let component: InspirationBoardComponent;
  let fixture: ComponentFixture<InspirationBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspirationBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspirationBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
