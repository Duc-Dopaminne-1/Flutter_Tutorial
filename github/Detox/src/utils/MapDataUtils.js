import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import {getDirectionList, getLocationList} from '../assets/constants';
import ArrayUtils from './ArrayUtils';

export const parseDirection = (directions, toId = false) => {
  let arrayDirections = directions;
  if (
    isEmpty(arrayDirections) ||
    (Array.isArray(arrayDirections) && !ArrayUtils.hasArrayData(arrayDirections))
  ) {
    return '';
  }
  if (!Array.isArray(arrayDirections)) {
    arrayDirections = arrayDirections.split(',');
  }
  const directionList = getDirectionList();
  const parsedDirection = arrayDirections?.map(e => {
    let direction;
    directionList.forEach(e2 => {
      if (e === e2.name || e === e2.id) {
        direction = toId ? e2.id : e2.name;
      }
    });
    return direction ?? '';
  });
  return parsedDirection.join();
};

export const parseLocationToEnum = location => {
  const locationList = getLocationList();
  let locationEnum = null;
  locationList.forEach(e => {
    if (e.name === location) {
      locationEnum = e.id;
    }
  });
  return locationEnum;
};

export const mapIsFollowedIntoItem = ({listFollowIds, listItems, keyId}) => {
  if (listFollowIds && listFollowIds?.length > 0) {
    const itemTemp = cloneDeep(listItems);
    const listFollowed = itemTemp.map(item => {
      if (listFollowIds.includes(item[keyId])) {
        item.isFollowed = true;
      }
      return item;
    });
    return listFollowed;
  }
  return listItems;
};

export const filterShowPlusServices = (listServicesDefault = [], listPlusServices = []) => {
  return listServicesDefault.filter(e => {
    return listPlusServices.find(
      el => el?.requestTypeId === e?.requestTypeId && el?.isDisplayHomepage,
    );
  });
};
