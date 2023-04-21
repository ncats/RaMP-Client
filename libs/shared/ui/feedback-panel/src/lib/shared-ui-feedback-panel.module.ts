import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { FeedbackPanelComponent } from './feedback-panel/feedback-panel.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MatCardModule],
  declarations: [
    FeedbackPanelComponent
  ],
  exports: [
    FeedbackPanelComponent
  ]
})
export class SharedUiFeedbackPanelModule {}
