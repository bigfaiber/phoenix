import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationStep1Component } from './customer-registration-step1.component';

describe('CustomerRegistrationStep1Component', () => {
  let component: CustomerRegistrationStep1Component;
  let fixture: ComponentFixture<CustomerRegistrationStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
