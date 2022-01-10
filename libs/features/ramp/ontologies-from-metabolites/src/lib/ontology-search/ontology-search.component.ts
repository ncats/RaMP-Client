import {DOCUMENT} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {Ontology, RampQuery} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchOntologiesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-ontology-search',
  templateUrl: './ontology-search.component.html',
  styleUrls: ['./ontology-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OntologySearchComponent implements OnInit {
file!: any;
  ontologyRaw!: Ontology[];
  ontologyColumns: DataProperty[] = [
/*    new DataProperty({
      label: "ID Type",
      field: "idType",
      sortable: true
    }),*/
    new DataProperty({
      label: "Metabolites",
      field: "metabolites",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology",
      field: "ontology",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology Type",
      field: "HMDBOntologyType",
      sortable: true
    }),
    new DataProperty({
      label: "Source ID",
      field: "sourceId",
      sortable: true
    }),
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
     private ref: ChangeDetectorRef,
     private rampFacade: RampFacade,
     private http: HttpClient,
     @Inject(DOCUMENT) private dom: Document
  ) {
  }


  ngOnInit(): void {
    this.rampFacade.ontologies$.subscribe((res: {data: Ontology[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this.ontologyRaw = res.data;
        this.dataAsDataProperty = res.data.map((ontology: Ontology) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(ontology).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck()
    })
  }

  fetchOntologies(event: string[]): void {
  //  this.getFile(event);
    this.rampFacade.dispatch(fetchOntologiesFromMetabolites({analytes: event}))
  }

  getFile(analytes: string[]) {
    console.log("getting file");
    const httpOptions = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json'
    };
    this.http
      .post<any>(`http://127.0.0.1:5762/api/ontologies-from-metabolites-file`,  {metabolite: analytes},
        httpOptions).subscribe(res=> {
        console.log(res)
      this.file = new Blob([res], {type: 'text/tsv'});
      var link = this.dom.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(this.file);
        link.setAttribute("href", url);
        link.setAttribute("download", `$dvsf-download.tsv`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    })
  }
}
