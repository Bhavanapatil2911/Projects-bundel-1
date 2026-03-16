import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NocScreenComponent } from './noc-screen.component';

describe('NocScreenComponent', () => {
  let component: NocScreenComponent;
  let fixture: ComponentFixture<NocScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NocScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NocScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
