import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ActivatedRoute} from "@angular/router";
import {Pathway, PathwayEnrichment, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchEnrichmentFromPathways, fetchPathwaysFromAnalytes, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-pathway-enrichment',
  templateUrl: './pathway-enrichment.component.html',
  styleUrls: ['./pathway-enrichment.component.scss']
})
export class PathwayEnrichmentComponent extends PageCoreComponent implements OnInit {
  holmFormCtrl: FormControl = new FormControl(.10);
  fdrFormCtrl: FormControl = new FormControl(.10);
  minPathWayFormCtrl: FormControl = new FormControl(2);
  percentPathwayFormCtrl: FormControl = new FormControl(.2);
  percentAnalyteFormCtrl: FormControl = new FormControl(.2);

  query!: RampQuery;
  pathwaysLoading = false;
  enrichmentLoading = false;


  enrichmentRaw!: PathwayEnrichment[];
  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway Name",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaySource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Id",
      field: "pathwayId",
      sortable: true
    }),
/*    new DataProperty({
      label: "Pval Metabolite",
      field: "pval_Metab",
      sortable: true
    }),*/
    new DataProperty({
      label: "Analytes",
      field: "analytes",
      sortable: true
    }),
    new DataProperty({
      label: "Combined Pval",
      field: "Pval_combined",
      sortable: true
    }),
    new DataProperty({
      label: "Combined FDR Pval",
      field: "Pval_combined_FDR",
      sortable: true
    }),
    new DataProperty({
      label: "Combined Holm Pval",
      field: "Pval_combined_Holm",
      sortable: true
    })
  ]
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaySource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source ID",
      field: "pathwayId",
      sortable: true
    }),
    new DataProperty({
      label: "Analyte Name",
      field: "commonName",
      sortable: true
    })
  ]

  clusterProp =  new DataProperty({
    label: "Cluster Assignment",
    field: "cluster_assignment",
    sortable: true
  });

  matches = 0;
  dataAsDataProperty!: { [key: string]: DataProperty }[];
  pathwayDataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route);
  }


  ngOnInit(): void {
    this.rampFacade.pathwayEnrichment$.subscribe((res: PathwayEnrichment[] | undefined) => {
      if (res && res.length) {
        console.log(res);
        this.enrichmentRaw = res;
        //  this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
        this.dataAsDataProperty = res.map((enrichment: PathwayEnrichment) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(enrichment).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.enrichmentLoading = false;
        this.ref.markForCheck()
      }
    })

    this.rampFacade.pathways$.subscribe((res: {data: Pathway[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapPathwaysData(res.data);
      }
/*      if (res && res.query) {
        this.query = res.query;
      }*/
      this.pathwaysLoading = false;
      this.ref.markForCheck();
    })

    this.holmFormCtrl.valueChanges.subscribe(change=> this.holmFormCtrl.setValue(change, {onlySelf: true, emitEvent: false}))
    this.fdrFormCtrl.valueChanges.subscribe(change=> this.fdrFormCtrl.setValue(change, {onlySelf: true, emitEvent: false}))
  }

  fetchEnrichment(event: string[]): void {
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({analytes: event}));
    this.pathwaysLoading = true;
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(fetchEnrichmentFromPathways({
      pathways: event,
      p_holmadj_cutoff: this.holmFormCtrl.value,
      p_fdradj_cutoff: this.fdrFormCtrl.value
    }))
  }

  setCluster(event: MatCheckboxChange){
    if(event.source.checked) {
       this.enrichmentColumns = this.enrichmentColumns.concat([this.clusterProp]);
    } else {
      this.enrichmentColumns = this.enrichmentColumns.filter(prop => prop.field != 'cluster_assignment');
    }
    this.ref.detectChanges();
  }

  private _mapPathwaysData(data: any): void {
    this.pathwayDataAsDataProperty = data.map((analyte: Pathway) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }
}
