import { TestBed } from '@angular/core/testing';

import { SampleContaminantLinkService } from './sample-contaminant-link.service';

describe('SampleContaminantLinkService', () => {
  let service: SampleContaminantLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleContaminantLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
