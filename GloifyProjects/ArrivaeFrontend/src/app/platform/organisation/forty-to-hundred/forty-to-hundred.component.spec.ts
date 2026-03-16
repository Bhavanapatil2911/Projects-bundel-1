import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FortyToHundredComponent } from './forty-to-hundred.component';

describe('FortyToHundredComponent', () => {
  let component: FortyToHundredComponent;
  let fixture: ComponentFixture<FortyToHundredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FortyToHundredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FortyToHundredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
