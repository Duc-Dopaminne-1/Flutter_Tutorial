import { BACKGROUND_COLOR } from '../constants/colors';

export const getChartValues = value => {
  if (!value || value <= 0) {
    return {
      value: 0,
      strokeColor: BACKGROUND_COLOR.Flamingo
    };
  }
  if (value < 25) {
    return {
      value: value / 100,
      strokeColor: BACKGROUND_COLOR.Flamingo
    };
  } else if (value >= 25 && value < 75) {
    return {
      value: value / 100,
      strokeColor: BACKGROUND_COLOR.LightOrange
    };
  } else {
    return {
      value: value <= 100 ? value / 100 : 1,
      strokeColor: BACKGROUND_COLOR.GreenLight
    };
  }
};
