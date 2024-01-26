import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import {
  FisherResult,
  FishersDataframe, Ontology,
  RampDataGeneric,
  RampQuery
} from "@ramp/models/ramp-models";
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { RampSelectors } from '@ramp/stores/ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'ramp-page-core',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCoreComponent {
  protected readonly store = inject(Store);
  destroyRef = inject(DestroyRef);
  changeRef = inject(ChangeDetectorRef);
  protected dom = inject(DOCUMENT);

  @Input()
  supportedIdTypes!: string[];

  supportedIds!: { analyteType: string; idTypes: string[] }[];

  @Input()
  function!: string;

  @Input()
  input!: string;

  @Input()
  examples!: string;

  @Input()
  title!: string;

  @Input()
  description!: string;

  dataframe!: FishersDataframe;

  query: RampQuery = {
    functionCall: '',
    numFoundIds: 0,
  };

  matches: string[] = [];
  inputList: string[] = [];
  noMatches: string[] = [];
  dataAsDataProperty: { [key: string]: DataProperty }[] = [];
  downloadQueued = false;
  fuzzy = false;

  _toTSV<T extends RampDataGeneric>(data: any): string {
    if (data) {
      // grab the column headings (separated by tabs)
      const headings: string = Object.keys(data[0]).join('\t');
      // iterate over the data
      const rows: any = data.reduce(
        (acc: string[], c: T) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat([Object.values(c).join('\t')]);

          // finally joining each row with a line break
        },
        [headings],
      );
      return rows.join('\n');
    } else return '';
  }

  constructor() {
    this.store
      .pipe(
        select(RampSelectors.getSupportedIds),
        takeUntilDestroyed(this.destroyRef),
        map((res: any) => {
          if (res && res.data) {
            this.supportedIds = res.data;
          }
        }),
      )
      .subscribe();
  }

  _downloadFile(data: any, name: string, type: string = 'text/tsv') {
    if (this.dom) {
      const file = new Blob([data], { type: type });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }

  _getSupportedIds() {
    this.supportedIds = this.supportedIds?.filter(
      (type: { analyteType: string }) =>
        this.supportedIdTypes?.includes(type.analyteType),
    );
  }

  protected _mapData<T extends RampDataGeneric>(data: T[]): void {
    this.dataAsDataProperty = data.map((obj: T) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: string[]) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      return newObj;
    });
  }
}
