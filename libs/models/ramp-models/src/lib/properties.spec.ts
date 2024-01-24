import { Properties } from './properties';

describe('Properties', () => {
  it('should create an instance', () => {
    expect(
      new Properties({
        iso_smiles: 'dsfdsfsfsdfsf',
      }),
    ).toBeTruthy();
  });
});
