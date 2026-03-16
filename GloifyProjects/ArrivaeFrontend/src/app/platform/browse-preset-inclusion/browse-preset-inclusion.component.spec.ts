import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePresetInclusionComponent } from './browse-preset-inclusion.component';

describe('BrowsePresetInclusionComponent', () => {
  let component: BrowsePresetInclusionComponent;
  let fixture: ComponentFixture<BrowsePresetInclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsePresetInclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePresetInclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
