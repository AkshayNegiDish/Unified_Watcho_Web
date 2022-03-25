import { TestBed } from '@angular/core/testing';

import { UgcURLServiceService } from './ugc-urlservice.service';

describe('UgcURLServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UgcURLServiceService = TestBed.get(UgcURLServiceService);
    expect(service).toBeTruthy();
  });
});
