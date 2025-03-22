import { TestBed } from '@angular/core/testing';

import { ContaminantService } from './contaminant.service';

describe('ContaminantService', () => {
  let service: ContaminantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaminantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
