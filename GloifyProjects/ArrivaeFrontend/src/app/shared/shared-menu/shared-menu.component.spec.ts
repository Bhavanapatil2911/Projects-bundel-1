import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMenuComponent } from './shared-menu.component';

describe('SharedMenuComponent', () => {
  let component: SharedMenuComponent;
  let fixture: ComponentFixture<SharedMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
