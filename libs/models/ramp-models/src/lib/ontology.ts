export class Ontology {
  HMDBOntologyType!: string;
  idType?: string;
  metabolites?: string;
  ontology?: string;
  sourceId!: string;
  commonName?: string;
  rampOntologyId?: string;
  count!: number;

  constructor(obj: any) {
    if (obj.HMDBOntologyType) {
      this.HMDBOntologyType = obj.HMDBOntologyType;
    }
    if (obj.IDtype) {
      this.idType = obj.IDtype;
    }
    if (obj.Metabolites) {
      this.metabolites = obj.Metabolites;
    }
    if (obj.Ontology) {
      this.ontology = obj.Ontology;
    }
    if (obj.sourceId) {
      this.sourceId = obj.sourceId;
    }
    if (obj.commonName) {
      this.ontology = obj.commonName;
    }
    if (obj.rampOntologyId) {
      this.rampOntologyId = obj.rampOntologyId;
    }

    if (obj.metCount) {
      this.count = obj.metCount;
    }
  }
}
