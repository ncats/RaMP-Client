export class OntologyList {
  ontologyType!: string;
  values!: Ontology[];
  constructor(obj: Partial<OntologyList>) {
    if (obj.ontologyType) {
      this.ontologyType = obj.ontologyType;
    }
    if (obj.values) {
      this.values = obj.values
        // .map((ont:Partial<Ontology>) => new Ontology({...ont, source: obj.ontologyType}))
        .sort((a, b) => b.count - a.count);
    }
  }
}

export class Ontology {
  HMDBOntologyType!: string;
  idType?: string;
  metabolites?: string;
  ontology!: string;
  sourceId!: string;
  commonName?: string;
  rampOntologyId?: string;
  count!: number;
  value?: string;
  source?: string;

  constructor(obj: {[key: string]:unknown}) {
    if (obj['HMDBOntologyType']) {
      this.HMDBOntologyType = <string>obj['HMDBOntologyType'];
      this.source = <string>obj['HMDBOntologyType'];
    }
    if (obj['IDtype']) {
      this.idType = <string>obj['IDtype'];
    }
    if (obj['Metabolites']) {
      this.metabolites = <string>obj['Metabolites'];
    }
    if (obj['Ontology']) {
      this.ontology = <string>obj['Ontology'];
      this.value = <string>obj['Ontology'];
    }
    if (obj['sourceId']) {
      this.sourceId = <string>obj['sourceId'];
    }
    if (obj['commonName']) {
      this.ontology = <string>obj['commonName'];
      this.value = <string>obj['commonName'];
    }
    if (obj['rampOntologyId']) {
      this.rampOntologyId = <string>obj['rampOntologyId'];
    }

    if (obj['metCount']) {
      this.count = <number>obj['metCount'];
    }
  }
}
