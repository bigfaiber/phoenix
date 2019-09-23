import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileWrapperComponent } from './admin-profile-wrapper.component';

describe('AdminProfileWrapperComponent', () => {
  let component: AdminProfileWrapperComponent;
  let fixture: ComponentFixture<AdminProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
