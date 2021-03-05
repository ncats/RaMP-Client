export interface AnalyteMatch {
    input: string;
    rampIdList: Array<string>;
    idTypesList: Array<string>;
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
    idTypesList?: Array<string>;
    idTypes?: string;
    geneOrCompound: string;
    commonName: string;
    synonym?: string;
    isSelected?: boolean;
}
