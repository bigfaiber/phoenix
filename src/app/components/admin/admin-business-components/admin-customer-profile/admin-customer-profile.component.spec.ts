import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerProfileComponent } from './admin-customer-profile.component';

describe('AdminCustomerProfileComponent', () => {
  let component: AdminCustomerProfileComponent;
  let fixture: ComponentFixture<AdminCustomerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCustomerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
