import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroToFortyComponent } from './zero-to-forty.component';

describe('ZeroToFortyComponent', () => {
  let component: ZeroToFortyComponent;
  let fixture: ComponentFixture<ZeroToFortyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroToFortyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroToFortyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
