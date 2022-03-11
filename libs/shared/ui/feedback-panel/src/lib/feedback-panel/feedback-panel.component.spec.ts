import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPanelComponent } from './feedback-panel.component';

describe('FeedbackPanelComponent', () => {
  let component: FeedbackPanelComponent;
  let fixture: ComponentFixture<FeedbackPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
