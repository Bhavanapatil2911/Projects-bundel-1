import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoFilesComponent } from './mto-files.component';

describe('MtoFilesComponent', () => {
  let component: MtoFilesComponent;
  let fixture: ComponentFixture<MtoFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtoFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtoFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
