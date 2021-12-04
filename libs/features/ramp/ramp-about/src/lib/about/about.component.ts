import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import {loadSourceVersions, RampFacade} from '@ramp/stores/ramp-store';

export interface SourceVersion {
  rampDbVersion: string;
  dbModDate: string;
  status: string;
  dataSourceId: string;
  dataSourceName: string;
  dataSourceUrl: string;
  dataSourceVersion: string;
}

export interface EntityCount {
  entity: string;
  counts: { [sourceName: string]: number };
}

export interface SourceCount {
  entity: string;
  entitySourceId: string;
  entitySourceName: string;
  entityCount: number;
}

@Component({
  selector: 'ramp-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'about';

  genesData: any;
  compoundsData: any;
  apiBaseUrl = 'https://ramp-api-alpha.ncats.io/api/';
  sourceVersions!: Array<SourceVersion>;
  entityCounts!: Array<EntityCount>;
  entityCountsColumns: Array<string> = [''];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    private rampFacade: RampFacade
  ) {}

  ngOnInit(): void {
    this.rampFacade.dispatch(loadSourceVersions());
    this.rampFacade.sourceVersions$.subscribe((versions) =>
      console.log(versions)
    );
    // this.loadingService.setLoadingState(true);
    this.getVersionInfo();
    this.setEntityCounts();
    this.getAnalytesSourceIntersects();

    this.scrollDispatcher.scrolled().subscribe((data) => {
      if (data) {
        let scrollTop: number =
          data.getElementRef().nativeElement.scrollTop + 100;
        if (scrollTop === 175) {
          this.activeElement = 'about';
          this.changeDetector.detectChanges();
        } else {
          this.scrollSections.forEach((section) => {
            scrollTop = scrollTop - section.nativeElement.scrollHeight;
            if (scrollTop >= 0) {
              this.activeElement = section.nativeElement.nextSibling.id;
              this.changeDetector.detectChanges();
            }
          });
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  getVersionInfo(): void {
    const url = `${this.apiBaseUrl}source_versions`;
    this.http.get<Array<SourceVersion>>(url).subscribe((response) => {
      this.sourceVersions = response;
    });
  }

  setEntityCounts(): void {
    const url = `${this.apiBaseUrl}entity_counts`;
    this.http.get<Array<SourceCount>>(url).subscribe((response) => {
      if (!response || !response.length) {
        response = [];
      }
      this.entityCounts = this.processEntityCounts(response);
    });
  }

  private processEntityCounts(
    sourceCounts: Array<SourceCount>
  ): Array<EntityCount> {
    const group = new Map();
    sourceCounts.forEach((sourceCount) => {
      const key = sourceCount.entity;
      const collection = group.get(key);
      if (!collection) {
        const countDict = {};
        // @ts-ignore
        //todo: fix the ts-ignore
        countDict[sourceCount.entitySourceName] = sourceCount.entityCount;
        group.set(key, countDict);
      } else {
        collection[sourceCount.entitySourceName] = sourceCount.entityCount;
      }
      if (
        this.entityCountsColumns.indexOf(sourceCount.entitySourceName) === -1
      ) {
        this.entityCountsColumns.push(sourceCount.entitySourceName);
      }
    });
    const entityCounts = Array.from(group, (element) => {
      return {
        entity: element[0],
        counts: element[1],
      };
    });
    return entityCounts;
  }

  getAnalytesSourceIntersects(): void {
    const url = `${this.apiBaseUrl}analyte_intersects`;

    this.http.get<any>(url).subscribe((response) => {
      const ret = { compounds: [], genes: [] };
      // @ts-ignore

      Object.keys(response).map(
        (key) =>
          //todo: fix the ts-ignore
          // @ts-ignore
          (ret[key] = response[key].map((val, i) => {
            val.id = i;
            if (typeof val.sets === 'string') {
              val.sets = [val.sets];
            }
            return val;
          }))
      );
      this.compoundsData = ret.compounds;
      this.genesData = ret.genes;
      //  this.loadingService.setLoadingState(false);
    });
  }

  /**
   * scroll to section
   * @param el
   */
  public scroll(el: any): void {
    console.log(el);
    //  el.scrollIntoView(true);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }
}
