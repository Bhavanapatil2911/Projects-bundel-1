import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdustmentsComponent } from './adustments.component';

describe('AdustmentsComponent', () => {
  let component: AdustmentsComponent;
  let fixture: ComponentFixture<AdustmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdustmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
