import { TestBed } from '@angular/core/testing';

import { InfoContactoService } from './info-contacto.service';

describe('InfoContactoService', () => {
  let service: InfoContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoContactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
