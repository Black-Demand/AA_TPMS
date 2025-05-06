import { TestBed } from '@angular/core/testing';

import { TempDriverService } from './temp-driver.service';

describe('TempDriverService', () => {
  let service: TempDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
