export interface FisherTestResult {
    pathwayRampId: string;
    Pval?: number;
    Pval_combined?: number;
    PvalGene?: number;
    PvalMetab?: number;
    Num_In_Path?: number;
    Num_In_PathGene?: number;
    Num_In_PathMetab?: number;
    Total_In_Path?: number;
    Total_In_PathGene?: number;
    Total_In_PathMetab?: number;
    Pval_FDR?: number;
    Pval_combined_FDR?: number;
    Pval_Holm?: number;
    Pval_combined_Holm?: number;
    pathwayName: string;
    pathwaysourceId: string;
    pathwaysource: string;
    cluster_assignment?: string;
    negativeLogPVal: number;
    rampids: string;
}

export interface Cluster {
    cluster: string;
    pathways: string;
}

export interface ClusteringCoordinates {
    pathwayRampId: string;
    x: number;
    y: number;
    cluster_assignment: string | number;
    pathwayName: string;
}
