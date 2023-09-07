import { DOCUMENT } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Properties, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchPropertiesFromMetabolites,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from "rxjs";
import { STRUCTURE_VIEWER_COMPONENT } from '../features-ramp-properties-from-metabolites.module';

@Component({
  selector: 'ramp-properties-from',
  templateUrl: './properties-from-metabolites.component.html',
  styleUrls: ['./properties-from-metabolites.component.scss'],
})
export class PropertiesFromMetabolitesComponent
  extends PageCoreComponent
  implements OnInit
{
  propertiesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source ID',
      field: 'chem_source_id',
      sortable: true,
    }),
    /*    new DataProperty({
      label: "Common Name",
      field: "common_name",
      sortable: true
    }),*/
    new DataProperty({
      label: 'Metabolite',
      field: 'imageUrl',
      customComponent: STRUCTURE_VIEWER_COMPONENT,
    }),
    /*    new DataProperty({
      label: "Smiles",
      field: "iso_smiles"
    }),*/
    new DataProperty({
      label: 'InCHI',
      field: 'inchi',
    }),
    new DataProperty({
      label: 'InCHI Key',
      field: 'inchi_key',
    }),
    new DataProperty({
      label: 'Molecular Formula',
      field: 'mol_formula',
    }),
    new DataProperty({
      label: 'Mass',
      field: 'monoisotop_mass',
      sortable: true,
    }),
    new DataProperty({
      label: 'Molecular Weight',
      field: 'mw',
      sortable: true,
    }),
  ];

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom: Document
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.properties$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Properties[]; query: RampQuery; dataframe: any} | undefined) => {
        if (res && res.data) {
          this._mapData(res.data);
          this.matches = Array.from(new Set(res.data.map(prop => prop.chem_source_id.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.query) {
          this.query = res.query;
        }
        if (res && res.dataframe) {
          this.dataframe = res.dataframe;
          if (this.downloadQueued) {
            this._downloadFile(this._toTSV(this.dataframe), 'fetchPropertiesFromMetabolites-download.tsv')
            this.downloadQueued = false;
          }
        }
        this.ref.markForCheck();
      }
    );
  }

  fetchProperties(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(
      fetchPropertiesFromMetabolites({ metabolites: event })
    );
  }
  fetchPropertiesFile(event: string[]): void {
    if(!this.dataframe) {
      this.fetchProperties(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(this._toTSV(this.dataframe), 'fetchPropertiesFromMetabolites-download.tsv' )
    }
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((obj: Properties) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });

      console.log(obj.iso_smiles)
      newObj.imageUrl.url = `${
        this.route.snapshot.data.renderUrl
      }(${encodeURIComponent(obj.iso_smiles)})?size=150`;
      console.log(newObj.imageUrl.url)
      console.log(`${
        this.route.snapshot.data.renderUrl
      }(${encodeURI(obj.iso_smiles)})?size=150`)
      newObj.imageUrl.label = newObj.common_name.value;
      return newObj;
    });
  }
}
