import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// import SwaggerUI = require("swagger-ui");
const SwaggerUI = require('swagger-ui')


@Component({
  selector: 'ramp-ramp-api',
  templateUrl: './ramp-api.component.html',
  styleUrls: ['./ramp-api.component.scss'],
})
export class RampApiComponent implements OnInit, AfterViewInit {
  /**
   * container that holds the swagger ui
   */
  @ViewChild('documentation') el!: ElementRef;


  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * create swagger ui viewer
   */
  ngAfterViewInit() {
    const ui = SwaggerUI({
      url: '/assets/ramp-api/data/ramp_openapi_with_extensions.yml',
      domNode: this.el.nativeElement
    });
    console.log(ui);
  }
}
