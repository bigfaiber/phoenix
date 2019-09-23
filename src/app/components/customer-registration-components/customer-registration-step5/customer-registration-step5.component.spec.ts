import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationStep5Component } from './customer-registration-step5.component';

describe('CustomerRegistrationStep5Component', () => {
  let component: CustomerRegistrationStep5Component;
  let fixture: ComponentFixture<CustomerRegistrationStep5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationStep5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
