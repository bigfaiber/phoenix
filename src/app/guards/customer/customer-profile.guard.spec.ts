import { TestBed, async, inject } from '@angular/core/testing';

import { CustomerProfileGuard } from './customer-profile.guard';

describe('CustomerProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerProfileGuard]
    });
  });

  it('should ...', inject([CustomerProfileGuard], (guard: CustomerProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
