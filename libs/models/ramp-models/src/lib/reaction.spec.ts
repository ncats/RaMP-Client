import { Reaction } from './reaction';

describe('Reaction', () => {
  it('should create an instance', () => {
    expect(
      new Reaction({
        Input_Analyte: 'L-Glutamic acid',
        Input_CatalyzedBy_CommonName: 'BCAT1',
        Input_CatalyzedBy_SourceIds:
          'uniprot:P54687; uniprot:P54687; entrez:586; ensembl:ENSG00000060982; uniprot:P54687; gene_symbol:BCAT1; gene_symbol:BCAT1; uniprot:A0A024RAV0; hmdb:HMDBP00301; uniprot:A0A087WYF2; uniprot:F5H2F2; entrez:586; gene_symbol:BCAT1',
      }),
    ).toBeTruthy();
  });
});
