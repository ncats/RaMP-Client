import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Inject,
  Input
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { select, Store } from "@ngrx/store";
import { RampQuery } from "@ramp/models/ramp-models";
import { DataProperty } from "@ramp/shared/ui/ncats-datatable";
import { map } from "rxjs";
import {
  RampSelectors
} from "@ramp/stores/ramp-store";

@Component({
    selector: 'ramp-page-core',
    template: '',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageCoreComponent {

  protected readonly store = inject(Store);
  destroyRef = inject(DestroyRef);
   changeRef = inject(ChangeDetectorRef);

  @Input()
  supportedIdTypes!: [{ analyteType: string; idTypes: string[] }] | undefined;

  supportedIds!: [{ analyteType: string; idTypes: string[] }];

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

  dataframe!: any;

  query: RampQuery = {
    functionCall: '',
    numFoundIds: 0,
  };

  matches: any[] = [];
  inputList: string[] = [];
  noMatches: string[] = [];
  dataAsDataProperty: { [key: string]: DataProperty }[] = [];
  downloadQueued = false;
  fuzzy = false;

  _toTSV(data: any[]): any[] {
    // grab the column headings (separated by tabs)
    const headings: string = Object.keys(data[0]).join('\t');
    // iterate over the data
    const rows: string[] = data
      .reduce(
        (acc, c) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat([Object.values(c).join('\t')]);

          // finally joining each row with a line break
        },
        [headings],
      )
      .join('\n');
    return rows;
  }

  constructor(
  //  protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom?: Document
  ) {
 //   this.title = this.route.snapshot.data.title;
 //   this.description = this.route.snapshot.data.description;
 //   this.examples = this.route.snapshot.data.examples;
//    this.input = this.route.snapshot.data.input;

    this.store
      .pipe(
        select(RampSelectors.getSupportedIds),
        takeUntilDestroyed(this.destroyRef),
        map((res: any) => {
      if (res && res.data) {
        this.supportedIds = res.data.filter((type: { analyteType: any }) =>
          this.supportedIdTypes?.includes(type.analyteType)
        );
      }
    })
      ).subscribe();
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
}
