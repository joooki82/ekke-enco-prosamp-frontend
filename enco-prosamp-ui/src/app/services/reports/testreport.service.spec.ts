import { TestBed } from '@angular/core/testing';

import { TestreportService } from './testreport.service';

describe('TestreportService', () => {
  let service: TestreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
