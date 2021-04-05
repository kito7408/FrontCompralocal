import { TestBed } from '@angular/core/testing';

import { PagereviewService } from './pagereview.service';

describe('PagereviewService', () => {
  let service: PagereviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagereviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
