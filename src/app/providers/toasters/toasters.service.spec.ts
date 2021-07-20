import { TestBed } from '@angular/core/testing';

import { ToastersService } from './toasters.service';

describe('ToastersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastersService = TestBed.get(ToastersService);
    expect(service).toBeTruthy();
  });
});
