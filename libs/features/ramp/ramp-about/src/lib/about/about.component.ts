import { ScrollDispatcher } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { EntityCount, SourceVersion } from '@ramp/models/ramp-models';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { initAbout, RampFacade } from '@ramp/stores/ramp-store';
import { tap } from 'rxjs';

@Component({
  selector: 'ramp-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'about';

  genesData!: any[];
  compoundsData!: any[];
  apiBaseUrl = 'https://ramp-api-alpha.ncats.io/api/';
  sourceVersions!: Array<SourceVersion>;
  entityCounts!: EntityCount[];
  entityCountsColumns: DataProperty[] = [
    new DataProperty({
      label: 'Category',
      field: 'status_category',
      sortable: true,
      sorted: 'asc',
    }),
    new DataProperty({
      label: 'ChEBI',
      field: 'chebi',
      sortable: true,
    }),
    new DataProperty({
      label: 'HMDB',
      field: 'hmdb',
      sortable: true,
    }),
    new DataProperty({
      label: 'KEGG',
      field: 'kegg',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS',
      field: 'lipidmaps',
      sortable: true,
    }),
    new DataProperty({
      label: 'Reactome',
      field: 'reactome',
      sortable: true,
    }),
    new DataProperty({
      label: 'WikiPathways',
      field: 'wiki',
      sortable: true,
    }),
  ];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    protected rampFacade: RampFacade
  ) {}

  ngOnInit(): void {
    this.rampFacade.dispatch(initAbout());
    this.rampFacade.allRampStore$
      .pipe(
        tap((data) => {
          if (data.sourceVersions) {
            this.sourceVersions = data.sourceVersions;
            this.changeDetector.markForCheck();
          }
          if (data.entityCounts) {
            this.entityCounts = data.entityCounts.map(
              (count: { [s: string]: unknown } | ArrayLike<unknown>) => {
                const newObj: { [key: string]: DataProperty } = {};
                Object.entries(count).map((value: any) => {
                  newObj[value[0]] = new DataProperty({
                    name: value[0],
                    label: value[0],
                    value: value[1],
                  });
                });
                return newObj;
              }
            );
            this.changeDetector.markForCheck();
          }
          if (data.geneIntersects) {
            this.genesData = data.geneIntersects;
            this.changeDetector.markForCheck();
          }
          if (data.metaboliteIntersects) {
            this.compoundsData = data.metaboliteIntersects;
            this.changeDetector.markForCheck();
          }
        })
      )
      .subscribe();

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

  /**
   * scroll to section
   * @param el
   */
  public scroll(el: any): void {
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
