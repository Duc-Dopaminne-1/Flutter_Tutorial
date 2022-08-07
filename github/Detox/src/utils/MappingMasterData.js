import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';

const getMappingCities = items => {
  return items.map(item => ({
    id: item.cityId,
    name: item.cityName,
  }));
};

const getGenderText = gender => {
  if (gender) {
    return gender.toUpperCase() === STRINGS.MALE
      ? translate(STRINGS.MALE)
      : translate(STRINGS.FEMALE);
  }
  return '';
};

export {getGenderText, getMappingCities};
