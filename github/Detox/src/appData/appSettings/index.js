import * as actionCreators from './actions';

export const setAppLanguage = language => {
  return actionCreators.update({language});
};

export const setOnboardingVersionViewed = version => {
  return actionCreators.update({onboardingVersionViewed: version});
};

export const clearAppSettings = async () => {
  //update app settings
  return actionCreators.clear();
};
