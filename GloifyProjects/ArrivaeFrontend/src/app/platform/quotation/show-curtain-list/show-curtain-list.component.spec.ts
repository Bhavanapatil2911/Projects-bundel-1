import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCurtainListComponent } from './show-curtain-list.component';

describe('ShowCurtainListComponent', () => {
  let component: ShowCurtainListComponent;
  let fixture: ComponentFixture<ShowCurtainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCurtainListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCurtainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
