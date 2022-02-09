export class FisherResult {
  num_In_Path_Metab!: number;
  num_In_Path_Gene!: number;
  Pval_Metab!: number;
  Pval_combined!: number;
  Pval_combined_FDR!: number;
  Pval_combined_Holm!: number;
  total_In_Path_Metab!: number;
  total_In_Path_Gene!: number;
  analytes!: string;
  pathwayName!: string;
  pathwaySource!: string;
  pathwayId!: string;
  cluster_assignment?: number;

  constructor (obj: any) {
    Object.assign(this, obj);

    if (obj.Num_In_Path_Metab) {
      this.num_In_Path_Metab = obj.Num_In_Path_Metab;
    }
    if (obj.Num_In_Path_Gene) {
      this.num_In_Path_Gene = obj.Num_In_Path_Gene;
    }
    if (obj.Pval_Metab) {
      this.Pval_Metab = obj.Pval_Metab;
    }
    if (obj.Total_In_Path_Metab) {
      this.total_In_Path_Metab = obj.Total_In_Path_Metab;
    }
    if (obj.Total_In_Path_Gene) {
      this.total_In_Path_Gene = obj.Total_In_Path_Gene;
    }
  }

}
