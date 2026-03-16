import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerAttendenceComponent } from './designer-attendence.component';

describe('DesignerAttendenceComponent', () => {
  let component: DesignerAttendenceComponent;
  let fixture: ComponentFixture<DesignerAttendenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerAttendenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
