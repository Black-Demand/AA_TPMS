import { TestBed } from '@angular/core/testing';

import { DashborardSummaryService } from './dashborard-summary.service';

describe('DashborardSummaryService', () => {
  let service: DashborardSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashborardSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
