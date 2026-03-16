import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoPoComponent } from './mto-po.component';

describe('MtoPoComponent', () => {
  let component: MtoPoComponent;
  let fixture: ComponentFixture<MtoPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtoPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtoPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
