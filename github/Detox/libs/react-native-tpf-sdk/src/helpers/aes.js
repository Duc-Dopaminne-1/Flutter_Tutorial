const CryptoJS = require('crypto-js');
export const decryptWithAES = (base64, secretKey) => {
  let ciphertext = CryptoJS.enc.Base64.parse(base64);
  let key = CryptoJS.enc.Latin1.parse(secretKey);
  let iv = CryptoJS.enc.Latin1.parse(secretKey);
  let plaintextData = CryptoJS.AES.decrypt({ ciphertext }, key, { iv });
  return plaintextData.toString(CryptoJS.enc.Latin1);
};
