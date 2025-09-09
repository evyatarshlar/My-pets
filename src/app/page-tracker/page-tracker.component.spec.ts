import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTrackerComponent } from './page-tracker.component';

describe('PageTrackerComponent', () => {
  let component: PageTrackerComponent;
  let fixture: ComponentFixture<PageTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
