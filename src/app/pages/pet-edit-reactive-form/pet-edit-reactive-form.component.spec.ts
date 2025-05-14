import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetEditReactiveFormComponent } from './pet-edit-reactive-form.component';

describe('PetEditReactiveFormComponent', () => {
  let component: PetEditReactiveFormComponent;
  let fixture: ComponentFixture<PetEditReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetEditReactiveFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetEditReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
