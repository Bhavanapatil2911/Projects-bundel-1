import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstMeetingCsComponent } from './first-meeting-cs.component';

describe('FirstMeetingCsComponent', () => {
  let component: FirstMeetingCsComponent;
  let fixture: ComponentFixture<FirstMeetingCsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstMeetingCsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstMeetingCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
