import { Component, Input } from '@angular/core';

@Component({
  selector: 'ramp-feedback-panel',
  templateUrl: './feedback-panel.component.html',
  styleUrls: ['./feedback-panel.component.scss'],
})
export class FeedbackPanelComponent {
  @Input() matchesLength = 0;
  @Input() dataLength?: number;
  @Input() inputLength?: number;
  @Input() noMatches?: string[];
  @Input() inputType?: string;
  @Input() function?: string;
  @Input() fuzzy = false;
}
