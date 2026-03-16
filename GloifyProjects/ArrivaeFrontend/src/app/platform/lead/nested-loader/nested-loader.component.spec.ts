import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedLoaderComponent } from './nested-loader.component';

describe('NestedLoaderComponent', () => {
  let component: NestedLoaderComponent;
  let fixture: ComponentFixture<NestedLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
