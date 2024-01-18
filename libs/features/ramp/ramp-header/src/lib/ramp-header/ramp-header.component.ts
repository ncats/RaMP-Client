import { Component, Input, ViewEncapsulation } from '@angular/core';
import { HeaderTemplateComponent, LinkTemplateProperty } from "@ramp/shared/ui/header-template";
import { FlexModule } from '@angular/flex-layout/flex';

@Component({
    selector: 'ramp-header',
    templateUrl: './ramp-header.component.html',
    styleUrls: ['./ramp-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [HeaderTemplateComponent, FlexModule],
})
export class RampHeaderComponent {
  @Input() links!: LinkTemplateProperty[];
}
