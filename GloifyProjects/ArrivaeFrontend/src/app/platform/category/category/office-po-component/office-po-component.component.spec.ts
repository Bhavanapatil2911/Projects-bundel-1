import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficePoComponentComponent } from './office-po-component.component';

describe('OfficePoComponentComponent', () => {
  let component: OfficePoComponentComponent;
  let fixture: ComponentFixture<OfficePoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficePoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficePoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
