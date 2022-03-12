import { Analyte } from './analyte';

describe('Analyte', () => {
  it('should create an instance', () => {
    expect(
      new Analyte({
        analyteName: 'tim',
        sourceAnalyteIDs: 'tim',
        geneOrCompound: 'tim',
        pathwayName: 'tim',
        pathwayCategory: 'tim',
        pathwayType: 'tim',
      })
    ).toBeTruthy();
  });
});
