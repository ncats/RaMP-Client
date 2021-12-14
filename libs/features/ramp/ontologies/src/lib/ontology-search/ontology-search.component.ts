import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Ontology} from "@ramp/models/ramp-models";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchOntologiesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";

export const OntologyColumns: Array<{ value: string; display: string }> = [
  {
    value: 'IDtype',
    display: 'Id Type'
  },
  {
    value: 'Metabolites',
    display: 'Metabolites'
  },
  {
    value: 'Ontology',
    display: 'Ontology'
  },
  {
    value: 'biofluidORcellular',
    display: 'Biofluid Or Cellular'
  },
  {
    value: 'sourceId',
    display: 'Source Id'
  }
];

@Component({
  selector: 'ramp-ontology-search',
  templateUrl: './ontology-search.component.html',
  styleUrls: ['./ontology-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OntologySearchComponent implements OnInit {
  inputFormCtrl: FormControl = new FormControl();
  ontologyAsDataProperty!: { [key: string]: DataProperty }[];
  ontologyRaw!: Ontology[];

  ontologyColumns: DataProperty[] = [
    new DataProperty({
      label: "ID Type",
      field: "idType",
      sortable: true
    }),
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

  matches = 0;
  queryCount = 0;
  retArr!: string[];

  function!: string;
  examples!: string;
  title!: string;
  description!: SafeHtml;

  constructor(
    private rampFacade: RampFacade,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    console.log(this);
    this.title = this.route.snapshot.data.title;
    this.description = this.sanitizer.bypassSecurityTrustHtml(this.route.snapshot.data.description);
    this.examples = this.route.snapshot.data.examples;
    this.inputFormCtrl.setValue(this.examples);
    this.rampFacade.ontologies$.subscribe((res: Ontology[] | undefined) => {
      if (res && res.length) {
        this.ontologyRaw = res;
        this.matches = new Set([...res.map(ont => ont.sourceId)]).size
        this.ontologyAsDataProperty = res.map((ontology: Ontology) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(ontology).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchOntologies(): void {
    if (Array.isArray(this.inputFormCtrl.value)) {
     this.retArr = this.inputFormCtrl.value.map((val: string) => val = val.trim());
    } else {
      this.retArr = this.inputFormCtrl.value.trim().split(/[\t\n,;]+/).map((val: string) => val.trim());
    }
    this.queryCount = this.retArr.length;
    this.function = this.route.snapshot.data.function.replace('###REPLACE###', this.retArr.join(', '));
    this.rampFacade.dispatch(fetchOntologiesFromMetabolites({analytes: this.retArr}))
  }
}
