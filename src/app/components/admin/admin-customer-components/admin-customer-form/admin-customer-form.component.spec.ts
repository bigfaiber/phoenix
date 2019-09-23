import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerFormComponent } from './admin-customer-form.component';

describe('AdminCustomerFormComponent', () => {
  let component: AdminCustomerFormComponent;
  let fixture: ComponentFixture<AdminCustomerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCustomerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
