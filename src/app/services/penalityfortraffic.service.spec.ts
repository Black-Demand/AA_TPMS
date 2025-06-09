import { TestBed } from '@angular/core/testing';

import { PenalityfortrafficService } from './penalityfortraffic.service';

describe('PenalityfortrafficService', () => {
  let service: PenalityfortrafficService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenalityfortrafficService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
