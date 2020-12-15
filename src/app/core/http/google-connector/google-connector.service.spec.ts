import { TestBed } from '@angular/core/testing';

import { GoogleConnectorService } from './google-connector.service';

describe('GoogleConnectorService', () => {
  let service: GoogleConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
