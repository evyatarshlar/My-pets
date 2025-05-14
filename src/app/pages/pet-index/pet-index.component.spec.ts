import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetIndexComponent } from './pet-index.component';

describe('PetIndexComponent', () => {
  let component: PetIndexComponent;
  let fixture: ComponentFixture<PetIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PetIndexComponent]
});
    fixture = TestBed.createComponent(PetIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
