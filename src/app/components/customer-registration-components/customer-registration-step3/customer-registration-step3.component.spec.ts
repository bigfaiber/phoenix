import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationStep3Component } from './customer-registration-step3.component';

describe('CustomerRegistrationStep3Component', () => {
  let component: CustomerRegistrationStep3Component;
  let fixture: ComponentFixture<CustomerRegistrationStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
