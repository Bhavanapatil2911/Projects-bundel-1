import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurtainDetailsComponent } from './curtain-details.component';

describe('CurtainDetailsComponent', () => {
  let component: CurtainDetailsComponent;
  let fixture: ComponentFixture<CurtainDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurtainDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurtainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
