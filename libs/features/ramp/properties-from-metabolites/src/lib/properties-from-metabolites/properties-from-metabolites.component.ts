import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Properties, RampQuery} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchPropertiesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";
import {STRUCTURE_VIEWER_COMPONENT} from "../features-ramp-properties-from-metabolites.module";

@Component({
  selector: 'ramp-properties-from',
  templateUrl: './properties-from-metabolites.component.html',
  styleUrls: ['./properties-from-metabolites.component.scss']
})
export class PropertiesFromMetabolitesComponent implements OnInit {
  propertiesRaw!: Properties[];
  propertiesColumns: DataProperty[] = [
    new DataProperty({
      label: "Source ID",
      field: "chem_source_id",
      sortable: true
    }),
    new DataProperty({
      label: "Common Name",
      field: "common_name",
      sortable: true
    }),
    new DataProperty({
      label: "Structure",
      field: "imageUrl",
      customComponent: STRUCTURE_VIEWER_COMPONENT
    }),
    new DataProperty({
      label: "Smiles",
      field: "iso_smiles"
    }),
    new DataProperty({
      label: "InCHI",
      field: "inchi"
    }),
    new DataProperty({
      label: "InCHI Key",
      field: "inchi_key"
    }),
    new DataProperty({
      label: "Molecular Formula",
      field: "mol_formula"
    }),
    new DataProperty({
      label: "Mass",
      field: "monoisotop_mass",
      sortable: true
    }),
    new DataProperty({
      label: "Molecular Weight",
      field: "mw",
      sortable: true
    }),
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    private route: ActivatedRoute
  ) {
  }


  ngOnInit(): void {
    this.rampFacade.properties$.subscribe((res: {data: Properties[], query: RampQuery }| undefined) => {
      if (res && res.data) {
        this.propertiesRaw = res.data;
        this.dataAsDataProperty = res.data.map((properties: Properties) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(properties).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          newObj.imageUrl.url = `${this.route.snapshot.data.renderUrl}?structure=${encodeURIComponent(properties.iso_smiles)}&size=150`
          return newObj;
        })
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck()
    })
  }

  fetchProperties(event: string[]): void {
    this.rampFacade.dispatch(fetchPropertiesFromMetabolites({metabolites: event}))
  }
}
