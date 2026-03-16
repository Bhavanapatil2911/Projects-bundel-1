import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqViewNocComponent } from './boq-view-noc.component';

describe('BoqViewNocComponent', () => {
  let component: BoqViewNocComponent;
  let fixture: ComponentFixture<BoqViewNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoqViewNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoqViewNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
