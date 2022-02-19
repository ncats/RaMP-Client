import { Component, Optional } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RampQuery } from "@ramp/models/ramp-models";
import { DataProperty } from "@ramp/shared/ui/ncats-datatable";
import { RampFacade } from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-page-core',
  template: '',
})
export class PageCoreComponent {
  supportedIds!: [{ analyteType: string, idTypes: string[]}];
  function!: string;
  input!: string;
  examples!: string;
  title!: string;
  description!: string;
  query!: RampQuery;
  matches!: any;
  inputList: string[] = [];
  noMatches: string[] = [];
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  supportedIdTypes!: [{ analyteType: string, idTypes: string[]}] | undefined;

  constructor(
    protected route: ActivatedRoute,
    @Optional() protected rampFacade?: RampFacade
  ) {
    this.title = this.route.snapshot.data.title;
    this.description = this.route.snapshot.data.description;
    this.examples = this.route.snapshot.data.examples;
    this.input = this.route.snapshot.data.input;
    this.rampFacade?.supportedIds$.subscribe((res: any) => {
      if(res && res.data) {
        this.supportedIds = res.data.filter((type: { analyteType: any; }) => this.route.snapshot.data.supportedIdTypes.includes(type.analyteType));
      }
    })
  }
}
