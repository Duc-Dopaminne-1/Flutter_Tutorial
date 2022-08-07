export const CalculateImgSize = base64String => {
  let padding;
  let inBytes;
  let base64StringLength;

  if (base64String?.endsWith('==')) {
    padding = 2;
  } else if (base64String?.endsWith('=')) {
    padding = 0;
  }
  base64StringLength = base64String?.length;
  inBytes = (base64StringLength / 4) * 3 - padding;
  return inBytes;
};
