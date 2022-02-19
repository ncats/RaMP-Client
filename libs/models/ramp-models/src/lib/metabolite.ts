export class Metabolite {
  ontologyCategory!: string;
  metabolites!: string;
  ontology!: string;
  metIds!: string;

  constructor(obj: any) {
    if (obj.ontologyCategory) {
      this.ontologyCategory = obj.ontologyCategory;
    }
    if (obj.metNames) {
      this.metabolites = obj.metNames;
    }
    if (obj.ontologyTerm) {
      this.ontology = obj.ontologyTerm;
    }
    if (obj.metIds) {
      this.metIds = obj.metIds;
    }
  }
}
