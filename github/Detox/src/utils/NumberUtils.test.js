import NumberUtils from './NumberUtils';

describe('Map number to word', () => {
  it('Test 1', () => {
    const input = 1987604031;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual(
      'Một tỷ chín trăm tám mươi bảy triệu sáu trăm lẻ bốn ngàn không trăm ba mươi mốt',
    );
  });
  it('Test 2', () => {
    const input = 11987604031;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual(
      'Mười một tỷ chín trăm tám mươi bảy triệu sáu trăm lẻ bốn ngàn không trăm ba mươi mốt',
    );
  });
  it('Test 3', () => {
    const input = 11000002004;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Mười một tỷ không trăm lẻ hai ngàn không trăm lẻ bốn');
  });
  it('Test 4', () => {
    const input = 11000011024;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Mười một tỷ không trăm mười một ngàn không trăm hai mươi bốn');
  });
  it('Test 5', () => {
    const input = 20200020000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Hai mươi tỷ hai trăm triệu không trăm hai mươi ngàn');
  });
  it('Test 6', () => {
    const input = 20020200020000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual(
      'Hai mươi ngàn không trăm hai mươi tỷ hai trăm triệu không trăm hai mươi ngàn',
    );
  });
  it('Test 7', () => {
    const input = 2020200020000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual(
      'Hai ngàn không trăm hai mươi tỷ hai trăm triệu không trăm hai mươi ngàn',
    );
  });
  it('Test 8', () => {
    const input = 2011000000001001;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual(
      'Hai triệu không trăm mười một ngàn tỷ không trăm lẻ một ngàn không trăm lẻ một',
    );
  });
  it('Test 9', () => {
    const input = 1000000000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Một tỷ');
  });
  it('Test 10', () => {
    const input = 10000000000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Mười tỷ');
  });
  it('Test 11', () => {
    const input = 100000000000;
    const output = NumberUtils.mapNumberToWord(input);
    expect(output).toEqual('Một trăm tỷ');
  });
});
