import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LinkTemplateProperty } from '@ramp/shared/ui/header-template';

@Component({
  selector: 'ramp-header',
  templateUrl: './ramp-header.component.html',
  styleUrls: ['./ramp-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RampHeaderComponent implements OnInit {
  @Input() links!: LinkTemplateProperty[];
  constructor() {}

  ngOnInit(): void {}
}
