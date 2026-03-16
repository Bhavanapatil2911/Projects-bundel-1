import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoBatchesComponent } from './mto-batches.component';

describe('MtoBatchesComponent', () => {
  let component: MtoBatchesComponent;
  let fixture: ComponentFixture<MtoBatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtoBatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtoBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
