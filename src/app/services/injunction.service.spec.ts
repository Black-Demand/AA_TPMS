import { TestBed } from '@angular/core/testing';

import { InjunctionService } from './injunction.service';

describe('InjunctionService', () => {
  let service: InjunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
