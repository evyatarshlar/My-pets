import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFilterComponent } from './pet-filter.component';

describe('PetFilterComponent', () => {
  let component: PetFilterComponent;
  let fixture: ComponentFixture<PetFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PetFilterComponent]
});
    fixture = TestBed.createComponent(PetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
