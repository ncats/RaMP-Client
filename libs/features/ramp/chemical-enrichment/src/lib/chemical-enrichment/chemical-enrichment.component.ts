import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  ChemicalEnrichment,
  Classes,
  RampQuery,
} from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { CompleteDialogComponent } from '@ramp/shared/ui/complete-dialog';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchClassesFromMetabolites,
  fetchEnrichmentFromMetabolites,
  fetchEnrichmentFromMetabolitesFile,
  filterEnrichmentFromMetabolites,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'ramp-chemical-enrichment',
  templateUrl: './chemical-enrichment.component.html',
  styleUrls: ['./chemical-enrichment.component.scss'],
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
  enrichmentDataFrame: any;

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(DOCUMENT) protected dom: Document,
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.chemicalEnrichment$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (
          res: { data: ChemicalEnrichment[]; openModal?: boolean } | undefined,
        ) => {
          if (res && res.data) {
            this.dataAsDataProperty = res.data.map(
              (enrichment: ChemicalEnrichment) => {
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
      );

    this.rampFacade.classes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (
          res:
            | { data: Classes[]; query: RampQuery; dataframe: any }
            | undefined,
        ) => {
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
        },
      );
  }

  fetchEnrichment(event: string[]): void {
    this.classesLoading = true;
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.enrichmentLoading = true;
    if (this.file) {
      this.rampFacade.dispatch(
        fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
      this.rampFacade.dispatch(
        fetchEnrichmentFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
          background: this.file,
        }),
      );
    } else {
      this.rampFacade.dispatch(
        fetchClassesFromMetabolites({
          metabolites: event,
          biospecimen: this.biospecimenCtrl.value,
        }),
      );
      this.rampFacade.dispatch(
        fetchEnrichmentFromMetabolites({
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
    this.rampFacade.dispatch(
      fetchEnrichmentFromMetabolitesFile({
        metabolites: this.inputList,
        format: 'tsv',
      }),
    );
  }

  filterEnrichments() {
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(
      filterEnrichmentFromMetabolites({
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
