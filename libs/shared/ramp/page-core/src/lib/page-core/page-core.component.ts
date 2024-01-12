import { DOCUMENT } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RampQuery } from '@ramp/models/ramp-models';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { RampFacade } from '@ramp/stores/ramp-store';
import { Subject } from 'rxjs';

@Component({
  selector: 'ramp-page-core',
  template: '',
})
export class PageCoreComponent {
  supportedIds!: [{ analyteType: string; idTypes: string[] }];
  function!: string;
  input!: string;
  examples!: string;
  title!: string;
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

  supportedIdTypes!: [{ analyteType: string; idTypes: string[] }] | undefined;

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<any> = new Subject();

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
    protected route: ActivatedRoute,
    @Optional() protected rampFacade?: RampFacade,
    @Inject(DOCUMENT) protected dom?: Document,
  ) {
    this.title = this.route.snapshot.data.title;
    this.description = this.route.snapshot.data.description;
    this.examples = this.route.snapshot.data.examples;
    this.input = this.route.snapshot.data.input;
    this.rampFacade?.supportedIds$.subscribe((res: any) => {
      if (res && res.data) {
        this.supportedIds = res.data.filter((type: { analyteType: any }) =>
          this.route.snapshot.data.supportedIdTypes.includes(type.analyteType),
        );
      }
    });
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

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next('bye-bye');
    this.ngUnsubscribe.complete();
  }
}
