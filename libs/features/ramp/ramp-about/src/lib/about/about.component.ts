import { ScrollDispatcher } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef, inject,
  OnInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { select, Store } from "@ngrx/store";
import { EntityCount, SourceVersion } from '@ramp/models/ramp-models';
import { DataProperty, NcatsDatatableComponent } from "@ramp/shared/ui/ncats-datatable";
import { UpsetComponent } from "@ramp/shared/visualizations/upset-chart";
import { LoadRampActions } from "@ramp/stores/ramp-store";
import {tap } from "rxjs";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import * as RampSelectors from '@ramp/stores/ramp-store';


@Component({
    selector: 'ramp-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FlexModule,
        ExtendedModule,
        MatListModule,
        NgClass,
        NgIf,
        CdkScrollable,
        NgFor,
        NcatsDatatableComponent,
        UpsetComponent,
    ],
})
export class AboutComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'about';

  genesData!: any[];
  compoundsData!: any[];
  sourceVersions!: Array<SourceVersion>;
  entityCounts!: EntityCount[];
  databaseUrl!: string;
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
  dbVersion!: string;
  dbUpdated!: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(LoadRampActions.loadRampStats())
    this.store.pipe(
      select(RampSelectors.getAllRamp),
      takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          if (data.sourceVersions) {
            this.sourceVersions = data.sourceVersions;
            if (this.sourceVersions.length > 0) {
              const first = this.sourceVersions[0];
              if (first.ramp_db_version) {
                this.dbVersion = first.ramp_db_version;
              }
              if (first.db_mod_date) {
                this.dbUpdated = first.db_mod_date;
              }
            }

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
              },
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
          if (data.databaseUrl) {
            this.databaseUrl = data.databaseUrl;
          }
        }),
      )
      .subscribe();

    this.scrollDispatcher
      .scrolled()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
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
