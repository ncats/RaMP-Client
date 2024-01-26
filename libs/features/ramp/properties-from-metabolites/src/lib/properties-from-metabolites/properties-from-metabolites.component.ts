import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { Properties, RampResponse } from '@ramp/models/ramp-models';
import { InputRowComponent } from '@ramp/shared/ramp/input-row';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from '@ramp/shared/ramp/query-page';
import { DescriptionComponent } from '@ramp/shared/ui/description-panel';
import { FeedbackPanelComponent } from '@ramp/shared/ui/feedback-panel';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { STRUCTURE_VIEWER_COMPONENT } from "@ramp/shared/ui/ncats-structure-viewer";
import {
  PropertiesFromMetaboliteActions,
  RampSelectors,
} from '@ramp/stores/ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'ramp-properties-from',
  templateUrl: './properties-from-metabolites.component.html',
  styleUrls: ['./properties-from-metabolites.component.scss'],
  standalone: true,
  imports: [
    DescriptionComponent,
    InputRowComponent,
    FeedbackPanelComponent,
    QueryPageComponent,
    TitleCasePipe,
  ],
})
export class PropertiesFromMetabolitesComponent
  extends PageCoreComponent
  implements OnInit
{
  @Input() renderUrl!: string;

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

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this._getSupportedIds();
    this.store
      .pipe(
        select(RampSelectors.getProperties),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Properties> | undefined) => {
          if (res && res.data) {
            this._mapPropertyData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((prop) => prop.chem_source_id.toLocaleLowerCase()),
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
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchPropertiesFromMetabolites-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        }),
      )
      .subscribe();
  }

  fetchProperties(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.store.dispatch(
      PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites({
        metabolites: event,
      }),
    );
  }
  fetchPropertiesFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchProperties(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchPropertiesFromMetabolites-download.tsv',
      );
    }
  }

  private _mapPropertyData(data: Properties[]): void {
    this.dataAsDataProperty = data.map((obj: Properties) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: string[]) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      newObj['imageUrl'].url = `${
        this.renderUrl
      }(${encodeURIComponent(obj.iso_smiles)})?size=150`;
      newObj['imageUrl'].label = newObj['common_name'].value;
      return newObj;
    });
  }
}
