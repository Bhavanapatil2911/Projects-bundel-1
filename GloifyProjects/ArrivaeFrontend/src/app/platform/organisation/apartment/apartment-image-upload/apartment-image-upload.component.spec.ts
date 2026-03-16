import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentImageUploadComponent } from './apartment-image-upload.component';

describe('ApartmentImageUploadComponent', () => {
  let component: ApartmentImageUploadComponent;
  let fixture: ComponentFixture<ApartmentImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartmentImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartmentImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
