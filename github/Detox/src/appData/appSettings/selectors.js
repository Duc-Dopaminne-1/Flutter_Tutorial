export const get = state => state.appSettings;
export const getAppLanguage = state => {
  const settings = get(state);
  return settings.language;
};
export const getOnboardingVersionViewed = state => {
  const settings = get(state);
  return settings.onboardingVersionViewed;
};

export const getDateCloseIntroduce = state => {
  const settings = get(state);
  return settings.dateCloseIntroduce;
};
