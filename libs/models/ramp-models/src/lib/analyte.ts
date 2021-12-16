export class Analyte {
  analyteName!: string;
  sourceAnalyteIDs!: string;
  geneOrCompound!: string;
  pathwayName!: string;
  pathwayCategory!: string;
  pathwayType!: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
