export class Reaction {
  inputAnalyte!: string;
  inputCatalyzedByCommonName!: string;
  inputCatalyzedBySourceIdsArray!: string[];
  inputCatalyzedBySourceIdsString!: string;

  constructor(obj: any) {
    if (obj.Input_Analyte) {
      this.inputAnalyte = obj.Input_Analyte;
    }

    if (obj.Input_CatalyzedBy_CommonName) {
      this.inputCatalyzedByCommonName = obj.Input_CatalyzedBy_CommonName;
    }

    if (obj.Input_CatalyzedBy_SourceIds) {
      this.inputCatalyzedBySourceIdsString = obj.Input_CatalyzedBy_SourceIds;
      this.inputCatalyzedBySourceIdsArray =
        obj.Input_CatalyzedBy_SourceIds.split('; ');
    }
  }
}
