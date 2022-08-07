import CryptoJS from 'crypto-js';

function encryptString(inputString, secreteKey = '') {
  const encryptedData = CryptoJS.AES.encrypt(inputString, secreteKey);
  const encryptedString = encryptedData.toString();
  return encryptedString;
}

function decryptString(encryptedText, secreteKey = '') {
  const decryptedData = CryptoJS.AES.decrypt(encryptedText, secreteKey);
  const plainText = decryptedData.toString(CryptoJS.enc.Utf8);
  return plainText;
}

export {decryptString, encryptString};
