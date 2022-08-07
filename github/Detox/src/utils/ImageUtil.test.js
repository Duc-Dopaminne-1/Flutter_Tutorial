import {checkImageExtension} from './ImageUtil';

describe('Check image extension *.png, *.jpg, *.jpeg', () => {
  const input = 'text.jpg.png';
  it(`file png lower ${input}`, () => {
    const result = checkImageExtension(input);
    expect(result).toEqual(true);
  });
  it(`file png upper ${input.toUpperCase()}`, () => {
    const result = checkImageExtension(input.toUpperCase());
    expect(result).toEqual(true);
  });

  const input1 = 'text.jpg';
  it(`file jpg lower ${input1}`, () => {
    const result = checkImageExtension(input1);
    expect(result).toEqual(true);
  });
  it(`file jpg upper ${input1.toUpperCase()}`, () => {
    const result = checkImageExtension(input1.toUpperCase());
    expect(result).toEqual(true);
  });

  const input2 = 'text.jpeg';
  it(`file jpeg lower ${input2}`, () => {
    const result = checkImageExtension(input2);
    expect(result).toEqual(true);
  });
  it(`file jpeg upper ${input2.toUpperCase()}`, () => {
    const result = checkImageExtension(input2.toUpperCase());
    expect(result).toEqual(true);
  });

  const input3 = 'text.pdf';
  it(`file not image name lower ${input3}`, () => {
    const result = checkImageExtension(input3);
    expect(result).toEqual(false);
  });
  it(`file not image name upper ${input3.toUpperCase()}`, () => {
    const result = checkImageExtension(input3.toUpperCase());
    expect(result).toEqual(false);
  });
});
