export class Analyte {
  analyteName!: string;
  sourceAnalyteIDs!: string;
  geneOrCompound!: string;
  pathwayName!: string;
  pathwayCategory!: string;
  pathwayType!: string;

  constructor(obj: any) {
    console.log(obj);
    Object.assign(this, obj);
  }
}
