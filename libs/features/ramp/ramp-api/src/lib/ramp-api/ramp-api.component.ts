import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// import SwaggerUIBundle from "swagger-ui-dist";
 //ng const SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle

declare var SwaggerUIBundle: any;

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
    const ui = SwaggerUIBundle({
      url: '/assets/ramp-api/data/ramp_openapi_with_extensions.yml',
      domNode: this.el.nativeElement
    });
  }
}
