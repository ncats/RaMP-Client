import { FisherResult } from './fisher-result';

describe('FisherResult', () => {
  it('should create an instance', () => {
    expect(
      new FisherResult({
        num_In_Path_Metab: 2,
        Pval_Metab: 0.0042,
        Pval_combined: 0.0042,
        Pval_combined_FDR: 0.1551,
        Pval_combined_Holm: 1,
        total_In_Path_Metab: 58,
        analytes: 'creatine;l-glutamic acid;glutamate',
        pathwayName: 'Glycine, serine and threonine metabolism',
        pathwaysource: 'kegg',
        pathwaysourceId: 'map00260',
      }),
    ).toBeTruthy();
  });
});
