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
  ontology?: string;
  sourceId!: string;
  commonName?: string;
  rampOntologyId?: string;
  count!: number;
  value?: string;
  source?: string;

  constructor(obj: any) {
    if (obj.HMDBOntologyType) {
      this.HMDBOntologyType = obj.HMDBOntologyType;
      this.source = obj.HMDBOntologyType;
    }
    if (obj.IDtype) {
      this.idType = obj.IDtype;
    }
    if (obj.Metabolites) {
      this.metabolites = obj.Metabolites;
    }
    if (obj.Ontology) {
      this.ontology = obj.Ontology;
      this.value = obj.Ontology;
    }
    if (obj.sourceId) {
      this.sourceId = obj.sourceId;
    }
    if (obj.commonName) {
      this.ontology = obj.commonName;
      this.value = obj.commonName;
    }
    if (obj.rampOntologyId) {
      this.rampOntologyId = obj.rampOntologyId;
    }

    if (obj.metCount) {
      this.count = obj.metCount;
    }
  }
}
