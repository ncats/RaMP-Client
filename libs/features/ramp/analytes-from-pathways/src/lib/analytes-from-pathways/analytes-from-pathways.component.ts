import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Analyte, Pathway} from "@ramp/models/ramp-models";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchAnalytesFromPathways, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-analytes-from-pathways',
  templateUrl: './analytes-from-pathways.component.html',
  styleUrls: ['./analytes-from-pathways.component.scss']
})
export class AnalytesFromPathwaysComponent extends QueryPageComponent implements OnInit {
  analyteRaw!: Analyte[];
  analyteColumns: DataProperty[] = [
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
      label: "Analyte Name",
      field: "analyteName",
      sortable: true
    }),
    new DataProperty({
      label: "Source Analyte ID",
      field: "sourceAnalyteIDs",
      sortable: true
    }),
    new DataProperty({
      label: "Analyte Class",
      field: "geneOrCompound",
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

    this.rampFacade.analytes$.subscribe((res: Analyte[] | undefined) => {
      if (res && res.length) {
        this.analyteRaw = res;
       this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
        this.dataAsDataProperty = res.map((analyte: Analyte) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(analyte).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchAnalytes(): void {
    this.parseInput();
    this.rampFacade.dispatch(fetchAnalytesFromPathways({pathways: this.retArr}))
  }
}
