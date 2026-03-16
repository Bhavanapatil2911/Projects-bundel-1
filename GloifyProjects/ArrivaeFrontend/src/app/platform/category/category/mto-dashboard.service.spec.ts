import { TestBed, inject } from '@angular/core/testing';

import { MtoDashboardService } from './mto-dashboard.service';

describe('MtoDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MtoDashboardService]
    });
  });

  it('should be created', inject([MtoDashboardService], (service: MtoDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
