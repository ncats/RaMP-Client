export const AnalyteMatchesColumns: Array<{ value: string; display: string }> = [
    {
        value: 'input',
        display: 'Input'
    },
    {
        value: 'numAnalytes',
        display: '# Analytes Found'
    }
];

export const AnalyteColumns: Array<{ value: string; display: string }> = [
    {
        value: 'sourceId',
        display: 'Source Id'
    },
    {
        value: 'IDtype',
        display: 'Source'
    },
    {
        value: 'geneOrCompound',
        display: 'Type'
    },
    {
        value: 'commonName',
        display: 'Common Name'
    }
];

export const fisherTestColumns: Array<{ value: string; display: string }> = [
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
    {
        value: 'Pval',
        display: 'P Value'
    },
    {
        value: 'Pval_combined',
        display: 'Combined P Value'
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
        value: 'Pval_combined_FDR',
        display: 'Combined FDR P Value'
    },
    {
        value: 'Pval_Holm',
        display: 'Holm P Value'
    },
    {
        value: 'Pval_combined_Holm',
        display: 'Combined Holm P Value'
    }
];

export const ClusteringColumns: Array<{ value: string; display: string }> = [
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
    {
        value: 'cluster_assignment',
        display: 'Cluster Assignment'
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
