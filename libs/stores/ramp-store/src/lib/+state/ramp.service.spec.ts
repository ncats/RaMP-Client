import { TestBed } from '@angular/core/testing';

import { RampService } from './ramp.service';

describe('RampService', () => {
  let service: RampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
