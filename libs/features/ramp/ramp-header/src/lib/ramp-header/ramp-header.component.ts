import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LinkTemplateProperty } from '@ramp/shared/ui/header-template';

@Component({
  selector: 'ramp-header',
  templateUrl: './ramp-header.component.html',
  styleUrls: ['./ramp-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RampHeaderComponent {
  @Input() links!: LinkTemplateProperty[];
}
