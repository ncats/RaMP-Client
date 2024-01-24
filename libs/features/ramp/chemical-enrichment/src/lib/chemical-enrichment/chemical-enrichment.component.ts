import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { select } from '@ngrx/store';
import {
  ChemicalEnrichment,
  Classes,
  RampResponse,
} from '@ramp/models/ramp-models';
import { InputRowComponent } from '@ramp/shared/ramp/input-row';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from '@ramp/shared/ramp/query-page';
import { CompleteDialogComponent } from '@ramp/shared/ui/complete-dialog';
import { DescriptionComponent } from '@ramp/shared/ui/description-panel';
import { FeedbackPanelComponent } from '@ramp/shared/ui/feedback-panel';
import { LoadingComponent } from '@ramp/shared/ui/loading-spinner';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  ClassesFromMetabolitesActions,
  MetaboliteEnrichmentsActions,
  RampSelectors,
} from '@ramp/stores/ramp-store';
import { map } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ramp-chemical-enrichment',
  templateUrl: './chemical-enrichment.component.html',
  styleUrls: ['./chemical-enrichment.component.scss'],
  standalone: true,
  imports: [
    DescriptionComponent,
    MatTabsModule,
    InputRowComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    LoadingComponent,
    FeedbackPanelComponent,
    MatTooltipModule,
    QueryPageComponent,
    MatInputModule,
    MatRadioModule,
    TitleCasePipe,
  ],
})
export class ChemicalEnrichmentComponent
  extends PageCoreComponent
  implements OnInit
{
  @ViewChild('resultsTabs') resultsTabs!: MatTabGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  pValueFormCtrl: UntypedFormControl = new UntypedFormControl(0.2);
  pValueTypeFormCtrl: UntypedFormControl = new UntypedFormControl('fdr');
  biospecimenCtrl: UntypedFormControl = new UntypedFormControl();
  biospecimens: string[] = [
    'Blood',
    'Adipose',
    'Heart',
    'Urine',
    'Brain',
    'Liver',
    'Kidney',
    'Saliva',
    'Feces',
  ];

  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: 'Category',
      field: 'category',
      sortable: true,
      sorted: 'asc',
    }),
    new DataProperty({
      label: 'Class Name',
      field: 'class_name',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Hits',
      field: 'met_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop hits',
      field: 'pop_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Count',
      field: 'met_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop Count',
      field: 'pop_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'P Value',
      field: 'p_value',
      sortable: true,
      displayType: 'string',
    }),
    new DataProperty({
      label: 'adjP_BH',
      field: 'adjP_BH',
      sortable: true,
      displayType: 'string',
    }),
  ];
  classesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source IDs',
      field: 'sourceId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Names',
      field: 'commonNames',
    }),
    new DataProperty({
      label: 'ClassyFire Super Class',
      field: 'classyFireSuperClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Class',
      field: 'classyFireClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Sub Class',
      field: 'classyFireSubClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Category',
      field: 'lipidMapsCategory',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Main Class',
      field: 'lipidMapsMainClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Sub Class',
      field: 'lipidMapsSubClass',
      sortable: true,
    }),
  ];
  classesLoading = false;
  enrichmentLoading = false;

  classesAsDataProperty: { [key: string]: DataProperty }[] = [];
  fileName = '';
  file?: File;
  // enrichmentdataframe: FishersDataframe;

  constructor(
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this._getSupportedIds();

    this.store
      .pipe(
        select(RampSelectors.getChemicalEnrichment),
        takeUntilDestroyed(this.destroyRef),
        map(
          (
            res:
              | { data: ChemicalEnrichment[]; openModal?: boolean }
              | undefined,
          ) => {
            if (res && res.data) {
              this.dataAsDataProperty = res.data.map(
                (enrichment: ChemicalEnrichment) => {
                  const newObj: { [key: string]: DataProperty } = {};
                  Object.entries(enrichment).map((value: any) => {
                    newObj[value[0]] = new DataProperty({
                      name: value[0],
                      label: value[0],
                      value: value[1],
                    });
                  });
                  return newObj;
                },
              );
              this.enrichmentLoading = false;

              if (res.openModal) {
                const ref: MatDialogRef<CompleteDialogComponent> =
                  this.dialog.open(CompleteDialogComponent, {
                    data: {
                      title: 'Chemical Class',
                      tabs: ['Chemical Classes', 'Enriched Chemical Classes'],
                    },
                  });

                ref.afterClosed().subscribe((res) => {
                  if (res) {
                    this.resultsTabs.selectedIndex = res;
                    this.ref.markForCheck();
                  }
                });
              }
              this.ref.markForCheck();
            }
            /*if (res && res.dataframe) {
          this.enrichmentDataFrame = res.dataframe;
        }*/
          },
        ),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getClasses),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Classes> | undefined) => {
          if (res && res.data) {
            this._mapClasses(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((classes) => classes.sourceId.toLocaleLowerCase()),
              ),
            );
            this.noMatches = this.inputList.filter(
              (p: string) => !this.matches.includes(p.toLocaleLowerCase()),
            );
          }
          if (res && res.query) {
            this.query = res.query;
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
          }
          this.classesLoading = false;
          this.ref.markForCheck();
        }),
      )
      .subscribe();
  }

  fetchEnrichment(event: string[]): void {
    this.classesLoading = true;
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.enrichmentLoading = true;
    if (this.file) {
      this.store.dispatch(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
      this.store.dispatch(
        MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
    } else {
      this.store.dispatch(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
        }),
      );
      this.store.dispatch(
        MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
        }),
      );
    }
  }

  fetchClassesFile(): void {
    this._downloadFile(
      this._toTSV(this.dataframe),
      'fetchChemicalClass-download.tsv',
    );
  }

  fetchEnrichedClassesFile(): void {
    this.store.dispatch(
      MetaboliteEnrichmentsActions
        .fetchEnrichmentFromMetabolitesFile
        // {
        //  metabolites: this.inputList,
        //   format: 'tsv',
        // }
        (),
    );
  }

  filterEnrichments() {
    this.enrichmentLoading = true;
    this.store.dispatch(
      MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolites({
        pval_cutoff: this.pValueFormCtrl.value,
        pval_type: this.pValueTypeFormCtrl.value,
      }),
    );
  }

  private _mapClasses(data: any): void {
    this.classesAsDataProperty = data.map((obj: Classes) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      return newObj;
    });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.fileName = this.file.name;
      this.ref.markForCheck();
    }
  }

  cancelUpload() {
    this.fileName = '';
    this.fileUpload.nativeElement.value = '';
    this.file = undefined;
    this.ref.markForCheck();
  }
}
