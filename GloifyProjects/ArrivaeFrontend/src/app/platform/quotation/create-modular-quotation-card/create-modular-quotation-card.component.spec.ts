import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModularQuotationCardComponent } from './create-modular-quotation-card.component';

describe('CreateModularQuotationCardComponent', () => {
  let component: CreateModularQuotationCardComponent;
  let fixture: ComponentFixture<CreateModularQuotationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModularQuotationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModularQuotationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
