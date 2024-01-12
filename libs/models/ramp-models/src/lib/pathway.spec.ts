import { Pathway } from './pathway';

describe('Pathway', () => {
  it('should create an instance', () => {
    expect(
      new Pathway({
        pathwayName: 'tim',
        pathwaysource: 'tim',
        pathwaysourceId: 'tim',
        pathwayCategory: 'tim',
        pathwayType: 'tim',
        analyteName: 'tim',
      }),
    ).toBeTruthy();
  });
});
