import { DOCUMENT, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef, inject,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { select, Store } from "@ngrx/store";
import { Metabolite, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from "@ramp/shared/ramp/query-page";
import { DescriptionComponent } from "@ramp/shared/ui/description-panel";
import { FeedbackPanelComponent } from "@ramp/shared/ui/feedback-panel";
import { FilterPanelComponent } from '@ramp/shared/ui/filter-panel';
import { LoadingComponent } from "@ramp/shared/ui/loading-spinner";
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
FetchOntologiesActions, MetaboliteFromOntologyActions, RampSelectors
} from "@ramp/stores/ramp-store";
import { distinctUntilChanged, map } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@angular/flex-layout/flex';

@Component({
    selector: 'ramp-metabolites-from-ontologies',
    templateUrl: './metabolites-from-ontologies.component.html',
    styleUrls: ['./metabolites-from-ontologies.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        DescriptionComponent,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NgFor,
        NgIf,
        FilterPanelComponent,
        MatButtonModule,
        ExtendedModule,
        MatIconModule,
        MatTooltipModule,
        LoadingComponent,
        FeedbackPanelComponent,
        QueryPageComponent,
        TitleCasePipe,
    ],
})
export class MetabolitesFromOntologiesComponent
  extends PageCoreComponent
  implements OnInit
{
  @ViewChildren('filterPanel') filterPanels!: QueryList<FilterPanelComponent>;
  @ViewChild('metaTabs') metaTabs!: ElementRef<MatTabGroup>;
  tabIndex = 0;

  allOntoFilterCtrl: UntypedFormControl = new UntypedFormControl();
  metaboliteColumns: DataProperty[] = [
    new DataProperty({
      label: 'Ontology',
      field: 'ontology',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology Type',
      field: 'ontologyCategory',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite',
      field: 'metabolites',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite IDs',
      field: 'metIds',
      sortable: true,
    }),
  ];
  ontologies!: any[];
  allOntologies!: any[];
  selectedOntologies: any[] = [];
  globalFilter?: string;
  disableSearch = false;
  loading = false;

  constructor(
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) protected override dom: Document,
  ) {
    super(dom);
  }

  ngOnInit(): void {
    this.store.dispatch(FetchOntologiesActions.fetchOntologies());
    this.allOntoFilterCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged())
      .subscribe((term) => {
        if (term.trim() && term.trim().length > 0) {
          this.ontologies = [];
          const matcher = new RegExp(term.trim(), 'i');
          this.allOntologies.forEach((onto) => {
            const newVal = { ...onto };
            newVal.values = newVal.values.filter((val: { value: any }) =>
              matcher.test(val.value),
            );
            if (newVal.values && newVal.values.length > 0) {
              this.ontologies.push(newVal);
            }
          });
          this.globalFilter = term;
          this.ref.markForCheck();
        } else {
          this.ontologies = this.allOntologies;
        }
      });


    this.store
      .pipe(
        select(RampSelectors.getontologiesList),
        takeUntilDestroyed(this.destroyRef),
        map((res: any) => {
          if (res && res.data) {
            this.ontologies = res.data.map(
              (ont: { ontologyType: string; values: any[]; count: number }) => {
                return {
                  ontologyType: ont.ontologyType,
                  values: ont.values
                    .map(
                      (val) =>
                        (val = {
                          value: val.ontology,
                          source: ont.ontologyType,
                          count: val.count,
                        }),
                    )
                    .sort((a, b) => b.count - a.count),
                };
              },
            );
            this.allOntologies = this.ontologies;
            this.ref.markForCheck();
          }
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getMetabolites),
        takeUntilDestroyed(this.destroyRef),
        map(
        (
          res:
            | { data: Metabolite[]; query: RampQuery; dataframe: any }
            | undefined,
        ) => {
          if (res && res.data) {
            this.dataAsDataProperty = res.data.map((metabolite: Metabolite) => {
              const newObj: { [key: string]: DataProperty } = {};
              Object.entries(metabolite).map((value: any, index: any) => {
                newObj[value[0]] = new DataProperty({
                  name: value[0],
                  label: value[0],
                  value: value[1],
                });
              });
              return newObj;
            });
            this.tabIndex = 1;
          }
          if (res && res.query) {
            this.query = res.query;
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
          }
          this.loading = false;
          this.ref.markForCheck();
        },
      )).subscribe();
  }

  setValues(values: any) {
    if (values.added) {
      this.selectedOntologies = Array.from(
        new Set(this.selectedOntologies.concat(values.added)),
      );
    }
    if (values.removed) {
      values.removed.forEach(
        (val: { value: any }) =>
          (this.selectedOntologies = this.selectedOntologies.filter(
            (ont) => ont.value !== val.value,
          )),
      );
    }
    let sum = 0;
    this.selectedOntologies.forEach((onto) => (sum += onto.count));
    this.disableSearch = sum > 10000;
  }

  clearAll() {
    this.filterPanels.forEach((panel) => panel.fieldSelection.clear());
  }

  fetchMetabolites(): void {
    this.loading = true;
    this.tabIndex = 0;
    const ontologiesList = this.selectedOntologies.map((ont) => ont.value);
    this.store.dispatch(
      MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies({ ontologies: ontologiesList }),
    );
  }

  fetchMetabolitesFile(): void {
    const ontologiesList = this.selectedOntologies.map((ont) => ont.value);
    if (ontologiesList.length) {
      this.store.dispatch(
        MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile({
          ontologies: ontologiesList,
          format: 'tsv',
        }),
      );
    }
  }
}
