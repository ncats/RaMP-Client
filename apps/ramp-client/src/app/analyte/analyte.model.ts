export interface AnalyteMatch {
  input: string;
  rampIdList: Array<string>;
  sourceIdsList: Array<string>;
  idTypesList: Array<string>;
  sourceIds: string;
  idTypes: string;
  typesList: Array<string>;
  types: string;
  numAnalytes: number;
  commonName: string;
  commonNameList: Array<string>;
  synonym?: string;
  synonymList: Array<string>;
  analytes: Array<Analyte>;
}

export interface Analyte {
  rampId: string;
  sourceId: string;
  IDtype: string;
  sourceIdsList?: Array<string>;
  idTypesList?: Array<string>;
  sourceIds?: string;
  idTypes?: string;
  geneOrCompound: string;
  commonName: string;
  commonNameList: Array<string>;
  synonym?: string;
  synonymList: Array<string>;
  isSelected?: boolean;
}
