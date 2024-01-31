import { Metabolite } from './metabolite';

describe('Metabolite', () => {
  it('should create an instance', () => {
    expect(
      new Metabolite( {
        ontologyTerm: "Microbe",
        ontologyCategory: "Source",
        metNames: "1-butyrate; BUT; butanoate; butyrate; Butyric acid; Ethylacetic acid",
        metIds: "CAS:107-92-6; chebi:17968; chebi:30772; chemspider:259; chemspider:94582; hmdb:HMDB0000039; hmdb:HMDB00039; kegg:C00246; lipidbank:DFA0004; LIPIDMAPS:LMFA01010004; plantfa:10013; pubchem:104775; pubchem:264; swisslipids:SLM:000001195; wikidata:Q193213; wikidata:Q55582441"
      }
      ),
    ).toBeTruthy();
  });
});
