// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export const phoneValidation = (value: string, countryCode: string) => {
  const number = phoneUtil.parseAndKeepRawInput(value, countryCode);
  return phoneUtil.isValidNumber(number, countryCode);
};
