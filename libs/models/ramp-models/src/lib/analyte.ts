export class Analyte {
  analyteName: string = '';
  sourceAnalyteIDs: string = '';
  geneOrCompound: string = '';
  pathwayName: string = '';
  pathwayCategory: string = '';
  pathwayType: string = '';
  pathwayId: string = '';

  constructor(obj: Partial<Analyte>) {
    // Object.assign(this, obj);

    if (obj.analyteName) {
      this.analyteName = obj.analyteName;
    }
    if (obj.sourceAnalyteIDs) {
      this.sourceAnalyteIDs = obj.sourceAnalyteIDs
        .split('; ')
        .sort((a: string, b: string) => a.localeCompare(b))
        .join('; ');
    }
    if (obj.geneOrCompound) {
      this.geneOrCompound = obj.geneOrCompound;
    }
    if (obj.pathwayName) {
      this.pathwayName = obj.pathwayName;
    }

    if (obj.pathwayCategory) {
      this.pathwayCategory = obj.pathwayCategory;
    }

    if (obj.pathwayType) {
      this.pathwayType = obj.pathwayType;
    }

    if (obj.pathwayId) {
      this.pathwayId = obj.pathwayId;
    }
  }
}
