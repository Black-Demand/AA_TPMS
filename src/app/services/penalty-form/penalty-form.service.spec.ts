import { TestBed } from '@angular/core/testing';

import { PenaltyFormService } from './penalty-form.service';

describe('PenaltyFormService', () => {
  let service: PenaltyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenaltyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
