import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsmSmMappingComponent } from './asm-sm-mapping.component';

describe('AsmSmMappingComponent', () => {
  let component: AsmSmMappingComponent;
  let fixture: ComponentFixture<AsmSmMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsmSmMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsmSmMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
