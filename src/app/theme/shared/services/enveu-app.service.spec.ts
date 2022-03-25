import { TestBed } from '@angular/core/testing';

import { EnveuAppService } from './enveu-app.service';

describe('EnveuAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnveuAppService = TestBed.get(EnveuAppService);
    expect(service).toBeTruthy();
  });
});
