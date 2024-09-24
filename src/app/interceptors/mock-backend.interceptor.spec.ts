import { TestBed } from '@angular/core/testing';

import { MockBackendInterceptor } from './mock-backend.interceptor';

describe('MockBackendInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackendInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MockBackendInterceptor = TestBed.inject(MockBackendInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
