import { TestBed, async, inject } from '@angular/core/testing';

import { AvoidCustomerRegistrationGuard } from './avoid-customer-registration.guard';

describe('AvoidCustomerRegistrationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvoidCustomerRegistrationGuard]
    });
  });

  it('should ...', inject([AvoidCustomerRegistrationGuard], (guard: AvoidCustomerRegistrationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
