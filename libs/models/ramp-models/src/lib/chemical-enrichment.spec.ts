import { ChemicalEnrichment } from './chemical-enrichment';

describe('ChemicalEnrichment', () => {
  it('should create an instance', () => {
    expect(
      new ChemicalEnrichment({
        adjP_BH: 2.4172e-13,
        category: 'ClassyFire_class',
        class_name: 'Carboxylic acids and derivatives',
        met_hits: 10,
        met_size: 13,
        'p-value': 1.2086e-13,
        pop_hits: 4270,
        pop_size: 145833,
      }),
    ).toBeTruthy();
  });
});
