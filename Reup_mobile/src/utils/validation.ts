// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const phoneValidation = (value: string, countryCode: string) => {
  const number = phoneUtil.parseAndKeepRawInput(value, countryCode);
  return phoneUtil.isValidNumber(number, countryCode);
};

export const phoneRegExp = /^\+(?:[0-9] ?){10,13}[0-9]$/;
