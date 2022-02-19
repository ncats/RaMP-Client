import { Ontology } from './ontology';

describe('Ontology', () => {
  it('should create an instance', () => {
    expect(
      new Ontology({
        HMDBOntologyType: 'tim',
        idType: 'tim',
        metabolites: 'tim',
        ontology: 'tim',
        sourceId: 'tim',
      })
    ).toBeTruthy();
  });
});
