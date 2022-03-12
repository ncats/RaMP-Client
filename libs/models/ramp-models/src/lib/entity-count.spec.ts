import { EntityCount } from './entity-count';

describe('EntityCount', () => {
  it('should create an instance', () => {
    expect(
      new EntityCount({
        ChEBI: '12636',
        HMDB: '217776',
        KEGG: '-',
        Reactome: '-',
        WikiPathways: '-',
        status_category: 'Chemical Property Records',
      })
    ).toBeTruthy();
  });
});
