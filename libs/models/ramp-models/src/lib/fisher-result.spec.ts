import { FisherResult } from './fisher-result';

describe('FisherResult', () => {
  it('should create an instance', () => {
    expect(
      new FisherResult({
        Num_In_Path_Metab: 2,
        Pval_Metab: 0.0042,
        Pval_combined: 0.0042,
        Pval_combined_FDR: 0.1551,
        Pval_combined_Holm: 1,
        Total_In_Path_Metab: 58,
        analytes: 'creatine;l-glutamic acid;glutamate',
        pathwayName: 'Glycine, serine and threonine metabolism',
        pathwaySource: 'kegg',
        pathwayId: 'map00260',
      }),
    ).toBeTruthy();
  });
});
