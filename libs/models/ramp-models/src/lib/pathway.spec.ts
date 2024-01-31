import { Pathway } from './pathway';

describe('Pathway', () => {
  it('should create an instance', () => {
    expect(
      new Pathway( {
        pathwayName: "10q22q23 copy number variation",
        pathwaySource: "wiki",
        pathwayId: "WP5402",
        inputId: "hmdb:HMDB0000148",
        commonName: "Glutamate; L-Glutamic acid"
      }),
    ).toBeTruthy();
  });
});
