import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqComparisonToolComponent } from './boq-comparison-tool.component';

describe('BoqComparisonToolComponent', () => {
  let component: BoqComparisonToolComponent;
  let fixture: ComponentFixture<BoqComparisonToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoqComparisonToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoqComparisonToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
