import { TestBed } from '@angular/core/testing';

import { HelpProyectService } from './help-proyect.service';

describe('HelpProyectService', () => {
  let service: HelpProyectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpProyectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
