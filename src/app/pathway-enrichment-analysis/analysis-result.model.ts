export interface FisherTestResult {
    pathwayRampId: string;
    Pval?: number;
    Pval_combined?: number;
    Num_In_Path: number;
    Total_In_Path: number;
    Pval_FDR?: number;
    Pval_combined_FDR?: number;
    Pval_Holm?: number;
    Pval_combined_Holm?: number;
    pathwayName: string;
    pathwaysourceId: string;
    pathwaysource: string;
    cluster_assignment?: string;
    negativeLogPVal: number;
}

export interface ClusteringCoordinates {
    pathwayRampId: string;
    x: number;
    y: number;
    cluster_assignment: string | number;
    pathwayName: string;
}
