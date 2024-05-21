export class Metabolite {
  ontologyCategory!: string;
  metIds!: string;
  metNames!: string;
  ontologyTerm!: string;

  constructor(obj: Partial<Metabolite>) {
    Object.assign(this, obj);

    if(obj['metIds']){
      this.metIds = (<string>obj["metIds"]).replace(/,/g, ', ')
    }
  }
}
