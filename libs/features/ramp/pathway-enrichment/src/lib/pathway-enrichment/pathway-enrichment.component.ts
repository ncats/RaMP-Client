import { DOCUMENT } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import {
  FisherResult,
  Pathway,
  RampQuery
} from "@ramp/models/ramp-models";
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchClusterFromEnrichment,
  fetchEnrichmentFromPathways,
  fetchPathwaysFromAnalytes, filterEnrichmentFromPathways,
  fetchClusterImageFile,
  RampFacade
} from "@ramp/stores/ramp-store";
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-pathway-enrichment',
  templateUrl: './pathway-enrichment.component.html',
  styleUrls: ['./pathway-enrichment.component.scss'],
})
export class PathwayEnrichmentComponent
  extends PageCoreComponent
  implements OnInit
{
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  minPathWayFormCtrl: FormControl = new FormControl(2);
  percentPathwayFormCtrl: FormControl = new FormControl(0.2);
  percentAnalyteFormCtrl: FormControl = new FormControl(0.2);

  pValueFormCtrl: FormControl = new FormControl(0.2);
  pValueTypeFormCtrl: FormControl = new FormControl('fdr');

  pathwaysLoading = false;
  enrichmentLoading = false;
  imageLoading = false;

  fileName = '';
  file?: File;

  enrichmentColumns: DataProperty[] = [
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
      label: "Metabolite Count",
      field: "metabCount"
    }),
    new DataProperty({
      label: "Gene Count",
      field: "geneCount",
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
    })
  ];
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
    })
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

  constructor(
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom: Document,
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.pathwayEnrichment$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: any | undefined) => {
        if (res && res.data) {
            this.dataAsDataProperty = res.data.map((enrichment: FisherResult) => {
              const newObj: { [key: string]: DataProperty } = {};
              Object.entries(enrichment).map((value: any, index: any) => {
                newObj[value[0]] = new DataProperty({
                  name: value[0],
                  label: value[0],
                  value: value[1],
                });
              });
              return newObj;
            });
          this.enrichmentLoading = false;
          this.allDataAsDataProperty = this.dataAsDataProperty;
          this.imageLoading = false;
          this.ref.markForCheck();
        }
        if (res && res.query) {
      this.query = res.query;
    }
        if (res && res.dataframe) {
          this.enrichedDataframe = res.dataframe;
        }
      }
    );

    this.rampFacade.pathways$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Pathway[]; query: RampQuery, dataframe: any } | undefined) => {
        if (res && res.data) {
          this._mapPathwaysData(res.data);
          this.matches = Array.from(new Set(res.data.map(pathway => pathway.inputId.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.dataframe) {
          this.dataframe = res.dataframe;
        }
        this.pathwaysLoading = false;
        this.ref.markForCheck();
      }
    );

    this.rampFacade.clusterPlot$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: any | undefined) => {
        if (res && res.length> 0) {
             this.image = this.sanitizer.bypassSecurityTrustHtml(res);
        }
        this.imageLoading = false;
        this.ref.markForCheck();
      }
    );

  }

  filterPathways() {
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(
      filterEnrichmentFromPathways({
        pval_type: this.pValueTypeFormCtrl.value,
        pval_cutoff: this.pValueFormCtrl.value,
        perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
        min_pathway_tocluster: this.minPathWayFormCtrl.value,
        perc_pathway_overlap: this.percentPathwayFormCtrl.value
      })
    );
  }

  clusterResults(){
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(
      fetchClusterFromEnrichment({
        perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
        min_pathway_tocluster: this.minPathWayFormCtrl.value,
        perc_pathway_overlap: this.percentPathwayFormCtrl.value
      })
    );
  }

  fetchEnrichment(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({ analytes: event }));
    this.pathwaysLoading = true;
    this.enrichmentLoading = true;
    this.imageLoading = true;
    if(this.file) {
      this.rampFacade.dispatch(
        fetchEnrichmentFromPathways({
          pathways: event,
          background: this.file
        })
      );
    } else {
      this.rampFacade.dispatch(
        fetchEnrichmentFromPathways({
          pathways: event
        })
      );
    }
  }

  setCluster(event: MatCheckboxChange) {
    if (event.source.checked) {
      this.enrichmentColumns = this.enrichmentColumns.concat([
        this.clusterProp,
      ]);
    } else {
      this.enrichmentColumns = this.enrichmentColumns.filter(
        (prop) => prop.field != 'cluster_assignment'
      );
    }
    this.ref.detectChanges();
  }

  fetchPathwaysFile(): void {
      this._downloadFile(this._toTSV(this.dataframe), 'fetchPathwaysFromAnalytes-download.tsv')
  }

  fetchEnrichedPathwaysFile(): void {
    this._downloadFile(this._toTSV(this.enrichedDataframe), 'fetchEnrichedPathwaysFromAnalytes-download.tsv')
  }

  fetchClusterImageFile(): void {
    this.rampFacade.dispatch(
         fetchClusterImageFile({
           perc_analyte_overlap: this.percentAnalyteFormCtrl.value,
           min_pathway_tocluster: this.minPathWayFormCtrl.value,
           perc_pathway_overlap: this.percentPathwayFormCtrl.value
         })
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
