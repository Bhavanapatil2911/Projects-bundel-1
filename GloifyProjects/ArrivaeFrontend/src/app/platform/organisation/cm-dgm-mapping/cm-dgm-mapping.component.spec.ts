import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmDgmMappingComponent } from './cm-dgm-mapping.component';

describe('CmDgmMappingComponent', () => {
  let component: CmDgmMappingComponent;
  let fixture: ComponentFixture<CmDgmMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmDgmMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmDgmMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
