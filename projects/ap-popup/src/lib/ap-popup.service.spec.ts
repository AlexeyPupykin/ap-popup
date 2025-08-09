import { TestBed } from '@angular/core/testing';

import { ApPopupService } from './ap-popup.service';

describe('ApPopupService', () => {
  let service: ApPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
