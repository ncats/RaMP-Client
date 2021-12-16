import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Ontology, Pathway} from "@ramp/models/ramp-models";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchPathwaysFromAnalytes, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-pathways-from-analytes',
  templateUrl: './pathways-from-analytes.component.html',
  styleUrls: ['./pathways-from-analytes.component.scss']
})
export class PathwaysFromAnalytesComponent extends QueryPageComponent implements OnInit {
  pathwayRaw!: Pathway[];
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: "Analyte Name",
      field: "commonName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway",
      field: "pathwayName",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source",
      field: "pathwaysource",
      sortable: true
    }),
    new DataProperty({
      label: "Pathway Source ID",
      field: "pathwaysourceId",
      sortable: true
    }),
  ]

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade
) {
    super(route, sanitizer);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.rampFacade.pathways$.subscribe((res: Pathway[] | undefined) => {
      if (res && res.length) {
        this.pathwayRaw = res;
      //  this.matches = new Set([...res.map(ont => ont.sourceId)]).size
        this.dataAsDataProperty = res.map((pathway: Pathway) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(pathway).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchPathways(): void {
    this.parseInput();
    this.rampFacade.dispatch(fetchPathwaysFromAnalytes({analytes: this.retArr}))
  }
}
