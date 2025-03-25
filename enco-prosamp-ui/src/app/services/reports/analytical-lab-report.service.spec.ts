import { TestBed } from '@angular/core/testing';

import { AnalyticalLabReportService } from './analytical-lab-report.service';

describe('AnalyticalLabReportService', () => {
  let service: AnalyticalLabReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticalLabReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
