import {translate} from '../assets/localize';

export const validateFields = (stateToValidate, validators) => {
  //check input values
  if (!stateToValidate || !validators) {
    return null; //no error
  }

  let errors = {};
  let hasError = false;

  for (const key in stateToValidate) {
    if (stateToValidate.hasOwnProperty(key)) {
      const value = stateToValidate[key];
      const validator = validators[key];
      const error = validator ? validator(value) : null;
      if (error) {
        hasError = true;
        errors = {...errors, [key]: translate(error)};
      }
    }
  }

  if (!hasError) {
    return null; //no error
  }
  return errors;
};
