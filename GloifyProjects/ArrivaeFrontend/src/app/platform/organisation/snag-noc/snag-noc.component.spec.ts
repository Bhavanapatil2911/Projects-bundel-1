import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnagNocComponent } from './snag-noc.component';

describe('SnagNocComponent', () => {
  let component: SnagNocComponent;
  let fixture: ComponentFixture<SnagNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnagNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnagNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
