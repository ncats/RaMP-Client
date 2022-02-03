import {Component, SimpleChange} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ramp-page-core',
  template: ''
})
export class PageCoreComponent {
   supportedIds!: string[];
   function!: string;
   input!: string;
   examples!: string;
   title!: string;
   description!: string;

  supportedIdTypes!: {
    metabolites: string[],
    genes: string[]
  } | undefined;

  constructor(
    protected route: ActivatedRoute
  ) {
    this.title = this.route.snapshot.data.title;
    this.description = this.route.snapshot.data.description;
    this.examples = this.route.snapshot.data.examples;
    this.input = this.route.snapshot.data.input;
  }

  ngOnChanges(change: {[n: string]: SimpleChange}) {
    if (change.supportedIdTypes && !change.supportedIdTypes.firstChange) {
   //   this.supportedIds = this.supportedIdTypes[this.route.snapshot.data.supportedIdTypes];
      console.log(this);
    }
  }
  }
