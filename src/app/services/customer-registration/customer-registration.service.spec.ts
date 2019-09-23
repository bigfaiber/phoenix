import { TestBed, inject } from '@angular/core/testing';

import { CustomerRegistrationService } from './customer-registration.service';

describe('CustomerRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerRegistrationService]
    });
  });

  it('should be created', inject([CustomerRegistrationService], (service: CustomerRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
