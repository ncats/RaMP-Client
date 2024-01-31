import { InjectionToken } from '@angular/core';
import { Params } from "@angular/router";

/**
 * main config object for a table cell, contains column/field data nad value info
 */
export class DataProperty {
  /**
   * id of object
   */
  id?: number;

  /**
   * name of field
   */
  field!: string;

  /**
   * readable label
   */
  label?: string;

  /**
   * object data property
   */
  value!: string;
  /**
   * optional url
   */
  url?: string;

  /**
   * optional tooltip to show when hovering the label
   */
  tooltip?: string;

  /**
   * should column be sortable
   */
  sortable?: boolean;

  /**
   * if sorted, then what direction?
   * todo merge with sortable
   */
  sorted?: 'asc' | 'desc';

  /**
   * internal link
   */
  internalLink?: string[];

  /**
   * link to external source, displayed with icon
   */
  externalLink?: string;

  /**
   * is column visible. used for show/hide columns
   */
  visible?: boolean;

  /**
   * width of column
   * todo: see if this is used/ works
   */
  width?: number;

  /**
   * token for a custom component
   */
  customComponent?: InjectionToken<string>;

  /**
   * pass a query params object for a routerLink
   */
  queryParams?: Params;

  /**
   * text description of the field. used for table tooltips
   */
  description?: string;

  displayType?: 'string' | 'number' | 'externalLink' | 'internalLink' | 'date';

  /**
   * deconstruct json as dataproperty object
   * @param data
   */
  constructor(data?: Partial<DataProperty>) {
    Object.assign(this, data);
    if (!this.field) {
      if (data) {
        this.field = <string>data['label'];
      }
    }
  }
}
