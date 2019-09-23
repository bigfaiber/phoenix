import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationStep2Component } from './customer-registration-step2.component';

describe('CustomerRegistrationStep2Component', () => {
  let component: CustomerRegistrationStep2Component;
  let fixture: ComponentFixture<CustomerRegistrationStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
