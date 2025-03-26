import { TestBed } from '@angular/core/testing';

import { TypevehiculesService } from './typevehicules.service';

describe('TypevehiculesService', () => {
  let service: TypevehiculesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypevehiculesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
