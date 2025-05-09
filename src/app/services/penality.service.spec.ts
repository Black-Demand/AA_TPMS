import { TestBed } from '@angular/core/testing';

import { PenalityService } from './penality.service';

describe('PenalityService', () => {
  let service: PenalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
