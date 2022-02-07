import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ChemicalEnrichment, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchEnrichmentFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-chemical-enrichment',
  templateUrl: './chemical-enrichment.component.html',
  styleUrls: ['./chemical-enrichment.component.scss']
})
export class ChemicalEnrichmentComponent extends PageCoreComponent implements OnInit {
  enrichmentRaw!: ChemicalEnrichment[];
  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway Name",
      field: "pathwayName",
      sortable: true
    }),
    /*    new DataProperty({
          label: "Pathway Category",
          field: "pathwayCategory",
          sortable: true
        }),*/
    new DataProperty({
      label: "Pathway Type",
      field: "pathwayType",
      sortable: true
    }),
    new DataProperty({
      label: "enrichment Name",
      field: "enrichmentName",
      sortable: true
    }),
    new DataProperty({
      label: "Source enrichment ID",
      field: "sourceenrichmentIDs",
      sortable: true
    }),
    new DataProperty({
      label: "enrichment Class",
      field: "geneOrCompound",
      sortable: true
    }),
  ]
  query!: RampQuery;

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
    this.rampFacade.chemicalEnrichment$.subscribe((res: ChemicalEnrichment[] | undefined) => {
      if (res && res.length) {
        this.enrichmentRaw = res;
        //  this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
        this.dataAsDataProperty = res.map((enrichment: ChemicalEnrichment) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(enrichment).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchEnrichment(event: string[]): void {
    this.rampFacade.dispatch(fetchEnrichmentFromMetabolites({metabolites: event}))
  }
}
