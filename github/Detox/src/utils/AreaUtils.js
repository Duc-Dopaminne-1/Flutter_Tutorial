import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';

const isAreaInList = (list, area) => {
  if (!Array.isArray(list) || !area) {
    return false;
  }
  for (const item of list) {
    if (item.city.id === area.city.id && item.district.id === area.district.id) {
      return true;
    }
  }
  return false;
};

const isCityInList = (list, area) => {
  if (!Array.isArray(list) || !area) {
    return false;
  }
  for (const item of list) {
    if (item.city.id === area.city.id) {
      return true;
    }
  }
  return false;
};

const checkErrorAreaInList = (list, area) => {
  if (isAreaInList(list, area)) {
    const dupArea = area.city.name + ', ' + area.district.name;
    return translate(Message.ERR_DUPLICATE_CHOSEN_AREA, {area: dupArea});
  }
  return '';
};

const checkErrorCityInList = (list, area) => {
  if (isCityInList(list, area)) {
    const dupArea = area.city.name;
    return translate(Message.ERR_DUPLICATE_CHOSEN_AREA, {area: dupArea});
  }
  return '';
};

const AreaUtils = {
  checkErrorAreaInList,
  checkErrorCityInList,
};

export default AreaUtils;
