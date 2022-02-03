import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PathwayEnrichment, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchEnrichmentFromPathways, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-pathway-enrichment',
  templateUrl: './pathway-enrichment.component.html',
  styleUrls: ['./pathway-enrichment.component.scss']
})
export class PathwayEnrichmentComponent extends PageCoreComponent implements OnInit {
  @Input()holmFormCtrl: FormControl = new FormControl(.10);
  @Input()fdrFormCtrl: FormControl = new FormControl(.10);
  query!: RampQuery;

  enrichmentRaw!: PathwayEnrichment[];
  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway Name",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaysource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Id",
      field: "pathwaysourceId",
      sortable: true
    }),
    new DataProperty({
      label: "Pval Metabolite",
      field: "pval_Metab",
      sortable: true
    }),
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
  matches = 0;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

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
        this.enrichmentRaw = res;
        //  this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
        this.dataAsDataProperty = res.map((enrichment: PathwayEnrichment) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(enrichment).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })

    this.holmFormCtrl.valueChanges.subscribe(change=> this.holmFormCtrl.setValue(change, {onlySelf: true, emitEvent: false}))
    this.fdrFormCtrl.valueChanges.subscribe(change=> this.fdrFormCtrl.setValue(change, {onlySelf: true, emitEvent: false}))
  }

  fetchEnrichment(event: string[]): void {
    const fdr = this.fdrFormCtrl.value
    this.rampFacade.dispatch(fetchEnrichmentFromPathways({
      pathways: event,
      p_holmadj_cutoff: this.holmFormCtrl.value,
      p_fdradj_cutoff: this.fdrFormCtrl.value
    }))
  }
}
