import { TestBed } from '@angular/core/testing';

import { AnalyteService } from './analyte.service';

describe('AnalyteService', () => {
  let service: AnalyteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
