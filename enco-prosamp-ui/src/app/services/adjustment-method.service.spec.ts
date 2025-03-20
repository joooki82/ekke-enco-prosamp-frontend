import { TestBed } from '@angular/core/testing';

import { AdjustmentMethodService } from './adjustment-method.service';

describe('AdjustmentMethodService', () => {
  let service: AdjustmentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjustmentMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
