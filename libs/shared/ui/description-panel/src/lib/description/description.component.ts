import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'ramp-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionComponent {
  @Input() function!: string | undefined;
  @Input() supportedIds?: string[];

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   *
   */
  protected _description = new BehaviorSubject<string>('');

  @Input()
  set description(value: string) {
    if(value) {
      this._description.next(value)
    }
  };

  get description(): string {
  return this._description.value;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

getDescription(): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(this._description.value);
}

}

