import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePresetComponent } from './browse-preset.component';

describe('BrowsePresetComponent', () => {
  let component: BrowsePresetComponent;
  let fixture: ComponentFixture<BrowsePresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsePresetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
