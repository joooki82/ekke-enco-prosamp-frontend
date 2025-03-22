import { TestBed } from '@angular/core/testing';

import { SamplingTypeService } from './sampling-type.service';

describe('SamplingTypeService', () => {
  let service: SamplingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamplingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
