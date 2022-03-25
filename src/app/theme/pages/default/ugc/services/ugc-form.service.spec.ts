import { TestBed } from '@angular/core/testing';

import { UgcFormService } from './ugc-form.service';

describe('UgcFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UgcFormService = TestBed.get(UgcFormService);
    expect(service).toBeTruthy();
  });
});
