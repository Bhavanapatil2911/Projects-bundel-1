import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmCmMappingComponent } from './sm-cm-mapping.component';

describe('SmCmMappingComponent', () => {
  let component: SmCmMappingComponent;
  let fixture: ComponentFixture<SmCmMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmCmMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmCmMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
