import { TestBed } from '@angular/core/testing';

import { ProdModelService } from './prod-model.service';

describe('ProdModelService', () => {
  let service: ProdModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
