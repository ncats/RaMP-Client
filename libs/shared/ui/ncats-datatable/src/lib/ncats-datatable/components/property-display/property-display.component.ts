import { Component, Input } from '@angular/core';
import { DataProperty } from '../../models/data-property';

/**
 * component to display a property, primarily in a table
 */
@Component({
  selector: 'ncats-property-display',
  templateUrl: './property-display.component.html',
  styleUrls: ['./property-display.component.scss'],
})
export class PropertyDisplayComponent {
  /**
   * show the label/field name
   * @type {boolean}
   */
  @Input() showLabel = true;

  /**
   * property object being shown
   */
  @Input() property!: DataProperty;
}
