import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEscalationComponent } from './manual-escalation.component';

describe('ManualEscalationComponent', () => {
  let component: ManualEscalationComponent;
  let fixture: ComponentFixture<ManualEscalationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualEscalationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEscalationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
