export class Analyte {
  analyteName!: string;
  sourceAnalyteIDs!: string;
  geneOrCompound!: string;
  pathwayName!: string;
  pathwayCategory!: string;
  pathwayType!: string;

  constructor(obj: any) {
    Object.assign(this, obj);
    this.sourceAnalyteIDs = this.sourceAnalyteIDs
      .split('; ')
      .sort((a, b) => a.localeCompare(b))
      .join('; ');
  }
}
