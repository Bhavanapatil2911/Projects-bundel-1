import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHierachyComponent } from './category-hierachy.component';

describe('CategoryHierachyComponent', () => {
  let component: CategoryHierachyComponent;
  let fixture: ComponentFixture<CategoryHierachyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryHierachyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryHierachyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
