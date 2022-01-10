import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'ramp-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionComponent {
  @Input() function!: string | undefined;
  @Input() description!: SafeHtml;
}
