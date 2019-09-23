import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDarkComponent } from './menu-dark.component';

describe('MenuDarkComponent', () => {
  let component: MenuDarkComponent;
  let fixture: ComponentFixture<MenuDarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
