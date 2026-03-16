import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtoOctrackComponent } from './obto-octrack.component';

describe('ObtoOctrackComponent', () => {
  let component: ObtoOctrackComponent;
  let fixture: ComponentFixture<ObtoOctrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObtoOctrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObtoOctrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
