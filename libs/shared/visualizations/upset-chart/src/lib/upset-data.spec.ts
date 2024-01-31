import { UpsetData } from './upset-data';

const UPSETTESTDATA = {
  sets: ['REACTOME', 'HMDB'],
  size: 61,
  id: 'cmpd_src_set_10',
};

describe('UpsetData', () => {
  it('should create an instance', () => {
    expect(new UpsetData(UPSETTESTDATA)).toBeTruthy();
  });
});
