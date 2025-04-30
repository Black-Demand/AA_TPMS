import { TestBed } from '@angular/core/testing';

import { TemporaryDriverRegistrationService } from './temporary-driver-registration.service';

describe('TemporaryDriverRegistrationService', () => {
  let service: TemporaryDriverRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryDriverRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
