import { TestBed } from '@angular/core/testing';

import { ContaminantGroupService } from './contaminant-group.service';

describe('ContaminantGroupService', () => {
  let service: ContaminantGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaminantGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
