import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'ramp-feedback-panel',
  templateUrl: './feedback-panel.component.html',
  styleUrls: ['./feedback-panel.component.scss'],
  standalone: true,
  imports: [MatCardModule],
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
