import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmGmMappingComponent } from './cm-gm-mapping.component';

describe('CmGmMappingComponent', () => {
  let component: CmGmMappingComponent;
  let fixture: ComponentFixture<CmGmMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmGmMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmGmMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
