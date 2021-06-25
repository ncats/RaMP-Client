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
    synonym?: string;
    isSelected?: boolean;
}
