export class FishersDataframe {
  analyte_type?: string[];
  fishresults?: FisherResult[];
  result_type?: string[];
}

export class FisherResult {
  Num_In_Path_Metab!: number;
  Num_In_Path_Gene!: number;
  Num_In_Path!: number;

  Pval_Metab!: number;
  Pval_combined!: number;
  Pval!: number; //analyte type = 'metabolites' or 'genes'

  Pval_combined_FDR!: number;
  Pval_FDR!: number;

  Pval_combined_Holm!: number;
  Pval_Holm!: number;

  Total_In_Path_Metab!: number;
  Total_In_Path_Gene!: number;
  Total_In_Path!: number;
  analytes!: string;
  pathwayName!: string;
  pathwaySource!: string;
  pathwayId!: string;
  cluster_assignment?: number;
  metabCount!: string;
  geneCount!: string;
  pathCount!: string;

  constructor(obj: Partial<FisherResult>) {
    Object.assign(this, obj);

    if (obj.Total_In_Path_Metab && obj.Num_In_Path_Metab) {
      this.metabCount = obj.Num_In_Path_Metab + '/' + obj.Total_In_Path_Metab;
    }

    if (obj.Total_In_Path_Gene && obj.Num_In_Path_Gene) {
      this.geneCount = obj.Num_In_Path_Gene + '/' + obj.Total_In_Path_Gene;
    }

    if (obj.Total_In_Path && obj.Num_In_Path) {
      this.pathCount = obj.Num_In_Path + '/' + obj.Total_In_Path;
    }
  }
}
