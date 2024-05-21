import { Analyte } from './analyte';

describe('Analyte', () => {
  it('should create an instance', () => {
    expect(
      new Analyte( {
        analyteName: "a beta-D-Gal-(1->4)-beta-D-Glc-(1<->1)-Cer(d18:1(4E)); LacCer",
      sourceAnalyteIDs: "chebi:17950; LIPIDMAPS:LMSP0501AB00; wikidata:Q39905739",
      geneOrCompound: "compound",
      pathwayName: "Ganglio series sphingolipid metabolism",
      pathwayId: "WP5299",
      pathwayCategory: "",
      pathwayType: "wiki"
  })
    ).toBeTruthy();
  });
});
