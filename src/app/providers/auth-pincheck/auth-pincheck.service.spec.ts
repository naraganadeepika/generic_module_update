import { TestBed } from '@angular/core/testing';

import { AuthPincheckService } from './auth-pincheck.service';

describe('AuthPincheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthPincheckService = TestBed.get(AuthPincheckService);
    expect(service).toBeTruthy();
  });
});
