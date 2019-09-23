import { TestBed, async, inject } from '@angular/core/testing';

import { InvestorGuard } from './investor.guard';

describe('InvestorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestorGuard]
    });
  });

  it('should ...', inject([InvestorGuard], (guard: InvestorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
