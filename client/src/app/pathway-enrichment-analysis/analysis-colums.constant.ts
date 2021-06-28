export const AnalyteMatchesColumns: Array<{ value: string; display: string }> = [
    {
        value: 'input',
        display: 'Input'
    },
    {
        value: 'sourceIds',
        display: 'Source IDs'
    },
    {
        value: 'types',
        display: 'Analyte Types'
    },
    {
        value: 'numAnalytes',
        display: '# Analytes Found'
    },
    {
        value: 'commonName',
        display: 'Common Name'
    }
];

export const AnalyteColumns: Array<{ value: string; display: string }> = [
    {
        value: 'sourceIds',
        display: 'Source IDs'
    },
    {
        value: 'geneOrCompound',
        display: 'Analyte Types'
    },
    {
        value: 'commonName',
        display: 'Common Name'
    }
];

export const fisherTestBaseColumns: Array<{ value: string; display: string }> = [
    {
        value: 'pathwayName',
        display: 'Pathway Name'
    },
    {
        value: 'pathwaysourceId',
        display: 'Pathway Source Id'
    },
    {
        value: 'pathwaysource',
        display: 'Pathway Source'
    },
];

export const fisherTestSingleTypeColumns: Array<{ value: string; display: string }> = [
    {
        value: 'Pval',
        display: 'P Value'
    },
    {
        value: 'Num_In_Path',
        display: '# in Path'
    },
    {
        value: 'Total_In_Path',
        display: 'Total in Path'
    },
    {
        value: 'Pval_FDR',
        display: 'FDR P Value'
    },
    {
        value: 'Pval_Holm',
        display: 'Holm P Value'
    }
];

export const fisherTestMultiTypeColumns: Array<{ value: string; display: string }> = [
    {
        value: 'Pval_combined',
        display: 'Combined P Value'
    },
    {
        value: 'PvalMetab',
        display: 'Metabolite P Value'
    },
    {
        value: 'PvalGene',
        display: 'Gene P Value'
    },
    {
        value: 'Num_In_PathMetab',
        display: '# Metabolites in Path'
    },
    {
        value: 'Num_In_PathGene',
        display: '# Genes in Path'
    },
    {
        value: 'Total_In_PathMetab',
        display: 'Total Metabolites in Path'
    },
    {
        value: 'Total_In_PathGene',
        display: 'Total Genes in Path'
    },
    {
        value: 'Pval_combined_FDR',
        display: 'Combined FDR P Value'
    },
    {
        value: 'Pval_combined_Holm',
        display: 'Combined Holm P Value'
    }
];

export const ClusteringColumns: Array<{ value: string; display: string }> = [
    {
        value: 'cluster',
        display: 'Cluster'
    },
    {
        value: 'pathways',
        display: 'Pathways'
    }
];

export const pathwayColumns: Array<{ value: string; display: string }> = [
    {
        value: 'pathwayName',
        display: 'Pathway Name'
    },
    {
        value: 'pathwaysourceId',
        display: 'Pathway Source Id'
    },
    {
        value: 'pathwaysource',
        display: 'Database Source'
    },
    {
        value: 'commonName',
        display: 'Analyte Common Name'
    }
];

export const idTypeColumns: Array<{ value: string; display: string }> = [
    {
        value: 'analyteType',
        display: 'Analyte Type'
    },
    {
        value: 'idTypes',
        display: 'ID Prefix Types'
    }
];
