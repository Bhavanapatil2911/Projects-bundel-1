import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignStdioComponent } from './design-stdio.component';

describe('DesignStdioComponent', () => {
  let component: DesignStdioComponent;
  let fixture: ComponentFixture<DesignStdioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignStdioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignStdioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
