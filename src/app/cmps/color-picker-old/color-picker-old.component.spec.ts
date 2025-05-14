import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerOldComponent } from './color-picker-old.component';

describe('ColorPickerOldComponent', () => {
  let component: ColorPickerOldComponent;
  let fixture: ComponentFixture<ColorPickerOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerOldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColorPickerOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
