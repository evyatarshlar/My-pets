import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningTrackerComponent } from './learning-tracker.component';

describe('LearningTrackerComponent', () => {
  let component: LearningTrackerComponent;
  let fixture: ComponentFixture<LearningTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
