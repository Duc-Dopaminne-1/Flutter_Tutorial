import isEmpty from 'lodash/isEmpty';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import logService from '../../service/logService';
import {getInterestedAreaString, getUserFullName} from '../../utils/UserAgentUtil';

const areasToUIModel = json => {
  const areas = [];
  if (!isEmpty(json)) {
    try {
      const areasList = JSON.parse(json);
      if (Array.isArray(areasList)) {
        areasList.forEach((value, index) => {
          areas.push({
            id: index,
            name: getInterestedAreaString({district: value?.districtName, city: value?.cityName}),
          });
        });
      }
    } catch (error) {
      logService.log(error);
      return areas;
    }
  }
  return areas;
};

const iconByName = name => {
  switch (name) {
    case 'apartment':
      return IMAGES.IC_ICON_AGENT_APARTMENT;
    case 'villa':
      return IMAGES.IC_ICON_AGENT_VILLA;
    case 'house':
      return IMAGES.IC_ICON_AGENT_HOME;
    case 'land':
      return IMAGES.IC_ICON_AGENT_PROPERTY;
    default:
      return IMAGES.IC_ICON_AGENT_PROPERTY;
  }
};

const propertiesToUiModel = json => {
  const properties = [];
  if (!isEmpty(json)) {
    try {
      const propertiesList = JSON.parse(json);
      if (Array.isArray(propertiesList)) {
        propertiesList.forEach((value, index) => {
          properties.push({
            id: index,
            name: translate(value.name),
            icon: iconByName(value.name),
          });
        });
      }
    } catch (error) {
      logService.log(error);
      return properties;
    }
  }
  return properties;
};

export const mapToAgentInfo = response => {
  return {
    name: getUserFullName(response),
    groupName: response.agentGroupDescription,
    agentGroupId: response.agentGroupId,
    email: response.email,
    phoneNumber: response.phoneNumber,
    agentCode: response.agentCode,
    image: response.profilePhoto,
    rank: response.agentRankName,
    isAgentLeader: response.isAgentLeader,
    rateNumber: response.rating,
    interestedProperties: propertiesToUiModel(response.preferPropertyTypes),
    interestedAreas: areasToUIModel(response.workingAreas),
    selfProperties: [],
    referralUser: {
      fullName: response?.referralUser?.fullName,
      userId: response?.referralUser?.userId,
    },
    deliveredProperties: [],
    topenerServiceTypes: JSON.parse(response?.topenerServiceTypes || '[]'),
  };
};
