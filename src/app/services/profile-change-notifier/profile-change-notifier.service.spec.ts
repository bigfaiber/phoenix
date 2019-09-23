import { TestBed, inject } from '@angular/core/testing';

import { ProfileChangeNotifierService } from './profile-change-notifier.service';

describe('ProfileChangeNotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileChangeNotifierService]
    });
  });

  it('should be created', inject([ProfileChangeNotifierService], (service: ProfileChangeNotifierService) => {
    expect(service).toBeTruthy();
  }));
});
