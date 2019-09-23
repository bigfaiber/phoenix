import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationStep4Component } from './customer-registration-step4.component';

describe('CustomerRegistrationStep4Component', () => {
  let component: CustomerRegistrationStep4Component;
  let fixture: ComponentFixture<CustomerRegistrationStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
