import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateapartmentComponent } from './createapartment.component';

describe('CreateapartmentComponent', () => {
  let component: CreateapartmentComponent;
  let fixture: ComponentFixture<CreateapartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateapartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateapartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
