import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { petResolver } from './pet.resolver';

describe('petResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => petResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
