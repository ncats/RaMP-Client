export class Metabolite {
  hmdbOntologyType!: string;
  metabolites!: string;
  ontology!: string;
  sourceId!: string;

  constructor(obj: any) {
    if (obj.HMDBOntologyType) {
      this.hmdbOntologyType = obj.HMDBOntologyType
    }
    if (obj.Metabolites) {
      this.metabolites = obj.Metabolites
    }
    if (obj.Ontology) {
      this.ontology = obj.Ontology
    }
    if (obj.sourceId) {
      this.sourceId = obj.sourceId
    }
  }
}
