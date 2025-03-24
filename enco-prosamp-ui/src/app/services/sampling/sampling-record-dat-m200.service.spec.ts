import { TestBed } from '@angular/core/testing';

import { SamplingRecordDatM200Service } from './sampling-record-dat-m200.service';

describe('SamplingRecordDatM200Service', () => {
  let service: SamplingRecordDatM200Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamplingRecordDatM200Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
