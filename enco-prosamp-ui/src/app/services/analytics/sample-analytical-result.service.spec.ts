import { TestBed } from '@angular/core/testing';

import { SampleAnalyticalResultService } from './sample-analytical-result.service';

describe('SampleAnalyticalResultService', () => {
  let service: SampleAnalyticalResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleAnalyticalResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
