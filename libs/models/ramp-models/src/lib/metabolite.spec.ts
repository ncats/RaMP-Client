import { Metabolite } from './metabolite';

describe('Metabolite', () => {
  it('should create an instance', () => {
    expect(
      new Metabolite({
        pathwayName: 'tim',
      })
    ).toBeTruthy();
  });
});
