export interface AnalyteMatch {
    input: string;
    numAnalytes: number;
    analytes: Array<Analyte>;
}

export interface Analyte {
    sourceId: string;
    IDtype: string;
    geneOrCompound: string;
    commonName: string;
    isSelected?: boolean;
}
