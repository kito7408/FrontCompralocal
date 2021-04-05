import { TestBed } from '@angular/core/testing';

import { ProdCommentService } from './prod-comment.service';

describe('ProdCommentService', () => {
  let service: ProdCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
