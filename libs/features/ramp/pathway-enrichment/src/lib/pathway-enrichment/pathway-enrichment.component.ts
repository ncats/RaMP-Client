import { DOCUMENT, NgIf, NgFor, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component, DestroyRef,
  ElementRef, inject,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from "@ngrx/store";
import { FisherResult, Pathway, RampQuery } from '@ramp/models/ramp-models';
import { InputRowComponent } from "@ramp/shared/ramp/input-row";
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from "@ramp/shared/ramp/query-page";
import { CompleteDialogComponent } from '@ramp/shared/ui/complete-dialog';
import { DescriptionComponent } from "@ramp/shared/ui/description-panel";
import { FeedbackPanelComponent } from "@ramp/shared/ui/feedback-panel";
import { LoadingComponent } from "@ramp/shared/ui/loading-spinner";
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
 PathwayEnrichmentsActions, RampSelectors
} from "@ramp/stores/ramp-store";
import { map, takeUntil } from "rxjs";
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout/flex';

@Component({
    selector: 'ramp-pathway-enrichment',
    templateUrl: './pathway-enrichment.component.html',
    styleUrls: ['./pathway-enrichment.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        DescriptionComponent,
        MatTabsModule,
        InputRowComponent,
        NgIf,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatOptionModule,
        NgFor,
        LoadingComponent,
        FeedbackPanelComponent,
        MatTooltipModule,
        ExtendedModule,
        QueryPageComponent,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        TitleCasePipe,
    ],
})
export class PathwayEnrichmentComponent
  extends PageCoreComponent
  implements OnInit
{
  @ViewChild('resultsTabs') resultsTabs!: MatTabGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  minPathWayFormCtrl: UntypedFormControl = new UntypedFormControl(2);
  percentPathwayFormCtrl: UntypedFormControl = new UntypedFormControl(0.5);
  percentAnalyteFormCtrl: UntypedFormControl = new UntypedFormControl(0.5);

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
  selectedSpecimen = '';
  pathwaysLoading = false;
  enrichmentLoading = false;
  imageLoading = false;
  fileName = '';
  file?: File;
  enrichmentColumns2: {
    metabolites: DataProperty[];
    genes: DataProperty[];
    both: DataProperty[];
  } = {
    metabolites: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      new DataProperty({
        label: 'Metabolite Count',
        field: 'metabCount',
      }),
      new DataProperty({
        label: 'Metabolites',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval_combined',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_combined_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_combined_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
    genes: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      new DataProperty({
        label: 'Gene Count',
        field: 'geneCount',
      }),
      /*new DataProperty({
       label: "Path Count",
       field: "pathCount",
     }),*/
      new DataProperty({
        label: 'Genes',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval_combined',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_combined_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_combined_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
    both: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      new DataProperty({
        label: 'Metabolite Count',
        field: 'metabCount',
      }),
      new DataProperty({
        label: 'Gene Count',
        field: 'geneCount',
      }),
      new DataProperty({
        label: 'Path Count',
        field: 'pathCount',
      }),
      new DataProperty({
        label: 'Analytes',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval_combined',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_combined_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_combined_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
  };

  selectedEnrichmentColumns!: DataProperty[];

  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: 'Input ID',
      field: 'inputId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source',
      field: 'pathwaySource',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source ID',
      field: 'pathwayId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'commonName',
      sortable: true,
    }),
  ];

  clusterProp = new DataProperty({
    label: 'Cluster Assignment',
    field: 'cluster_assignment',
    sortable: true,
    sorted: 'asc',
  });

  allDataAsDataProperty!: { [key: string]: DataProperty }[];
  pathwayDataAsDataProperty!: { [key: string]: DataProperty }[];
  image: any;
  enrichedDataframe: any;
  tooBig = false;

  constructor(
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    @Inject(DOCUMENT) protected override dom: Document,
  ) {
    super(dom);
  }

  ngOnInit(): void {
    this.selectedEnrichmentColumns = this.enrichmentColumns2['both'];
    this.store
      .pipe(
        select(RampSelectors.getPathwayEnrichment),
        takeUntilDestroyed(this.destroyRef),
        map(
          (res: any | undefined) => {
        if (res && res.data) {
          if (res.data.length) {
            this.dataAsDataProperty = res.data.map(
              (enrichment: FisherResult) => {
                const newObj: { [key: string]: DataProperty } = {};
                Object.entries(enrichment).map((value: any, index: any) => {
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

            this.allDataAsDataProperty = this.dataAsDataProperty;
            this.imageLoading = false;
            this.ref.markForCheck();
          } else {
            const ref: MatDialogRef<CompleteDialogComponent> = this.dialog.open(
              CompleteDialogComponent,
              {
                data: {
                  title: 'Pathway',
                  message: 'No enriched pathways found.',
                  tabs: ['Pathways'],
                },
              },
            );
            ref.afterClosed().subscribe((res) => {
              if (res) {
                this.resultsTabs.selectedIndex = res;
                this.ref.markForCheck();
              }
            });
            this.pathwaysLoading = false;
            this.enrichmentLoading = false;
            this.imageLoading = false;
          }
        }
        if (res && res.query) {
          this.query = res.query;
        }
        if (res && res.dataframe) {
          this.enrichedDataframe = res.dataframe;
        }

        if (res && res.openModal) {
          const ref: MatDialogRef<CompleteDialogComponent> = this.dialog.open(
            CompleteDialogComponent,
            {
              data: {
                title: 'Pathway',
                tabs: ['Pathways', 'Enriched Pathways', 'Clustered Pathways'],
              },
            },
          );

          ref.afterClosed().subscribe((res) => {
            if (res) {
              this.resultsTabs.selectedIndex = res;
              this.ref.markForCheck();
            }
          });
        }
      })).subscribe();

    this.store
      .pipe(
        select(RampSelectors.getPathways),
        takeUntilDestroyed(this.destroyRef),
        map(
        (
          res:
            | { data: Pathway[]; query: RampQuery; dataframe: any }
            | undefined,
        ) => {
          if (res && res.data) {
            this._mapPathwaysData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((pathway) => pathway.inputId.toLocaleLowerCase()),
              ),
            );
            this.noMatches = this.inputList.filter(
              (p: string) => !this.matches.includes(p.toLocaleLowerCase()),
            );
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
          }
          if (res && res.query) {
            this.query = res.query;
          }
          this.pathwaysLoading = false;
          this.ref.markForCheck();
        },
      )).subscribe();

    this.store
      .pipe(
        select(RampSelectors.getClusterPlot),
        takeUntilDestroyed(this.destroyRef),
        map(
        (res: any | undefined) => {
        if (res && res.length > 0) {
          this.tooBig = false;
          this.image = this.sanitizer.bypassSecurityTrustHtml(res);
        } else {
          this.tooBig = true;
        }
        this.imageLoading = false;
        this.ref.markForCheck();
      })).subscribe();
  }

  fetchEnrichment(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.store.dispatch(PathwayEnrichmentsActions.fetchPathwaysFromAnalytes({ analytes: event }));
    this.pathwaysLoading = true;
    this.enrichmentLoading = true;
    this.imageLoading = true;
    if (this.file) {
      this.store.dispatch(
        PathwayEnrichmentsActions.fetchEnrichmentFromPathways({
          analytes: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
    } else {
      this.store.dispatch(
        PathwayEnrichmentsActions.fetchEnrichmentFromPathways({
          analytes: event,
          biospecimen: this.biospecimenCtrl.value,
        }),
      );
    }
  }

  filterPathways() {
    this.enrichmentLoading = true;
    this.store.dispatch(
      PathwayEnrichmentsActions.filterEnrichmentFromPathways({
        pval_type: this.pValueTypeFormCtrl.value,
        pval_cutoff: this.pValueFormCtrl.value,
        perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
        min_pathway_tocluster: this.minPathWayFormCtrl.value,
        perc_pathway_overlap: this.percentPathwayFormCtrl.value,
      }),
    );
  }

  clusterResults() {
    this.enrichmentLoading = true;
    this.store.dispatch(
      PathwayEnrichmentsActions.fetchClusterFromEnrichment({
        perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
        min_pathway_tocluster: this.minPathWayFormCtrl.value,
        perc_pathway_overlap: this.percentPathwayFormCtrl.value,
      }),
    );
  }

  setCluster(event: MatCheckboxChange) {
    /*    if (event.source.checked) {
      this.enrichmentColumns = this.enrichmentColumns.concat([
        this.clusterProp,
      ]);
    } else {
      this.enrichmentColumns = this.enrichmentColumns.filter(
        (prop) => prop.field != 'cluster_assignment'
      );
    }*/
    this.ref.detectChanges();
  }

  fetchPathwaysFile(): void {
    this._downloadFile(
      this._toTSV(this.dataframe),
      'fetchPathwaysFromAnalytes-download.tsv',
    );
  }

  fetchEnrichedPathwaysFile(): void {
    this._downloadFile(
      this._toTSV(this.enrichedDataframe),
      'fetchEnrichedPathwaysFromAnalytes-download.tsv',
    );
  }

  fetchClusterImageFile(): void {
    this.store.dispatch(
      PathwayEnrichmentsActions.fetchClusterImageFile({
        perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
        min_pathway_tocluster: this.minPathWayFormCtrl.value,
        perc_pathway_overlap: this.percentPathwayFormCtrl.value,
      }),
    );
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

  private _mapPathwaysData(data: any): void {
    this.pathwayDataAsDataProperty = data.map((analyte: Pathway) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any, index: any) => {
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
