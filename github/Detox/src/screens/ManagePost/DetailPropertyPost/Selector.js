import isEmpty from 'lodash/isEmpty';

import {PROPERTY_LOCATION} from '../../../assets/constants';
import {STRINGS} from '../../../assets/localize/string';
import ArrayUtils from '../../../utils/ArrayUtils';
import {dropdownMapper, getValidDropdownData} from '../../../utils/DataProcessUtil';
import NumberUtils from '../../../utils/NumberUtils';
import PropertyType from '../PropertyType';
import {PRICE_DROPDOWN} from './BottomInfo';
import InitialState from './InitialState';

const mapToDropdownData = (data, propertyDetail, propertyType) => {
  const {propertyPostStatus, legalInfoes, banks, unitOfMeasures, directions, balconyDirections} =
    data;
  const propertyStatusData = getValidDropdownData(
    propertyPostStatus.edges,
    'propertyPostStatusId',
    'propertyPostStatusDescription',
    propertyDetail?.[STRINGS.PROPERTY_STATUS],
    true,
  );
  const legalStatusData = getValidDropdownData(
    legalInfoes.edges,
    'legalInfoId',
    'legalInfoDescription',
    propertyDetail?.[STRINGS.LEGAL_STATUS],
    true,
  );
  const directionsData = getValidDropdownData(
    directions,
    'id',
    'name',
    propertyDetail?.[STRINGS.DIRECTION],
    true,
  );
  const bankData = dropdownMapper(
    banks.edges,
    'bankId',
    'bankName',
    propertyDetail?.collateralizedAtBankId,
  );
  const currencyUnitsData = getValidDropdownData(
    unitOfMeasures.edges,
    'unitOfMeasureId',
    'unitOfMeasureName',
    propertyDetail?.unitOfMeasureId,
  );

  const balconyDirectionsData = getValidDropdownData(
    balconyDirections,
    'id',
    'name',
    propertyDetail?.[STRINGS.BALCONY_DIRECTION],
    true,
  );

  if (propertyType === PropertyType.land) {
    /**
     * living id = '7f8f1f03-a6ae-4356-a74e-05ec4cdce6e3'
     * id sẽ không đổi trên các môi trường khác nhau
     *
     * Action: propertyType == land, sẽ không có item living
     */
    const removeId = '7f8f1f03-a6ae-4356-a74e-05ec4cdce6e3';
    const filterDropdownData = propertyStatusData.dropdownData.filter(e => e.id !== removeId);
    propertyStatusData.dropdownData = filterDropdownData;
  }
  if (propertyType === PropertyType.apartment) {
    const removeLegalInfoIds = [
      'a442e2ac-e29f-4118-8d00-994c33d9f4b4', // Sổ đỏ
      '39e5966c-6dfa-4649-9f6f-3b120bf74eef', // Sổ đỏ chung, công chứng
    ];
    legalStatusData.dropdownData = legalStatusData.dropdownData.filter(
      e => !removeLegalInfoIds.some(removeId => removeId === e.id),
    );
  }

  const dropdownDatas = {
    propertyStatus: propertyStatusData.dropdownData,
    legalStatus: legalStatusData.dropdownData,
    directions: directionsData.dropdownData,
    balconyDirections: balconyDirectionsData.dropdownData,
    banks: bankData,
    currencyUnits: currencyUnitsData.dropdownData,
  };

  const selectedIds = {
    [STRINGS.PROPERTY_STATUS]: propertyStatusData.selectedId,
    [STRINGS.LEGAL_STATUS]: legalStatusData.selectedId,
    [STRINGS.DIRECTION]: directionsData.selectedId,
    [STRINGS.BALCONY_DIRECTION]: balconyDirectionsData.selectedId,
    [PRICE_DROPDOWN]: currencyUnitsData.selectedId,
  };

  // if (propertyType === PropertyType.land) {
  //   delete selectedIds[STRINGS.DIRECTION];
  // }

  // Delete balcony direction & dropdown data when property type is not the apartment
  if (propertyType !== PropertyType.apartment) {
    delete selectedIds[STRINGS.BALCONY_DIRECTION];
    delete dropdownDatas.balconyDirections;
  }

  return {data: dropdownDatas, selectedIds};
};

const buildingAreaFromState = state => {
  return NumberUtils.parseFloatValue(state[STRINGS.LAND_ACREAGE]);
};

const mapUiBuildingLine = value => {
  if (isEmpty(value)) {
    return null;
  }
  return NumberUtils.parseFloatValue(value);
};

const mapUiToPropertyDetail = (state, propertyType) => {
  const common = {
    propertyPostStatusId: state[STRINGS.PROPERTY_STATUS],
    blockName: state[STRINGS.TOWER] ?? '',
    floor: String(state[STRINGS.FLOOR] ?? ''),
    buildingArea: buildingAreaFromState(state),
    capetAreas: NumberUtils.parseFloatValue(state[STRINGS.USAGE_ACREAGE]),
    buildingLine: mapUiBuildingLine(state[STRINGS.BOUNDARY_LINE]),
    direction: state[STRINGS.DIRECTION] ?? '',
    numberOfFloor: NumberUtils.parseIntValue(state[STRINGS.NUMBER_OF_FLOOR]),
    numberOfBedrooms: NumberUtils.parseIntValue(state[STRINGS.NUMBER_OF_BEDROOM]),
    numberOfBathrooms: NumberUtils.parseIntValue(state[STRINGS.NUMBER_OF_BATHROOM]),
    legalInfoId: state[STRINGS.LEGAL_STATUS] ?? '',
    width: NumberUtils.parseFloatValue(state[STRINGS.WIDTH]),
    length: NumberUtils.parseFloatValue(state[STRINGS.LENGTH]),
    isCollateralized: false,
    collateralizedAtBankId: null,
    balconyDirection: state[STRINGS.BALCONY_DIRECTION] ?? '', // Hướng ban công
  };

  const isAlley = state?.propertyLocation === PROPERTY_LOCATION.ALLEY;
  const location = {
    propertyLocation: state?.propertyLocation,
    alleyWidth: isAlley ? NumberUtils.parseFloatValue(state?.alleyWidth) : null,
  };

  switch (propertyType) {
    case PropertyType.apartment:
      return {
        ...common,
        numberOfFloor: 0,
        capetAreas: 0,
        buildingLine: 0,
      };
    case PropertyType.land:
      return {
        ...common,
        ...location,
        capetAreas: 0,
        blockName: '',
        floor: '',
        buildingLine: 0,
        numberOfFloor: 0,
        numberOfBedrooms: 0,
        numberOfBathrooms: 0,
      };
    case PropertyType.villa:
    case PropertyType.house:
      return {
        ...common,
        ...location,
        blockName: '',
        floor: '',
        buildingLine: 0,
      };
    default:
      return common;
  }
};

const modalByType = (type, propertyDetail) => {
  const {
    blockName,
    floor,
    buildingArea,
    numberOfBathrooms,
    numberOfBedrooms,
    capetAreas,
    numberOfFloor,
    width,
    length,
    propertyLocation,
    alleyWidth,
    balconyDirection,
  } = propertyDetail;
  const widthLength = {
    [STRINGS.WIDTH]: NumberUtils.numberToString(width),
    [STRINGS.LENGTH]: NumberUtils.numberToString(length),
  };
  const location = {
    propertyLocation,
    alleyWidth: NumberUtils.numberToString(alleyWidth),
  };
  switch (type) {
    case PropertyType.apartment:
      return {
        ...widthLength,
        [STRINGS.TOWER]: blockName ?? '',
        [STRINGS.FLOOR]: floor ?? '',
        [STRINGS.LAND_ACREAGE]: NumberUtils.numberToString(buildingArea, ''),
        [STRINGS.NUMBER_OF_BATHROOM]: NumberUtils.numberToString(numberOfBathrooms, '1'),
        [STRINGS.NUMBER_OF_BEDROOM]: NumberUtils.numberToString(numberOfBedrooms, '1'),
        [STRINGS.BALCONY_DIRECTION]: balconyDirection ?? '', // Hướng ban công
      };
    case PropertyType.villa:
    case PropertyType.house:
      return {
        ...widthLength,
        ...location,
        [STRINGS.LAND_ACREAGE]: NumberUtils.numberToString(buildingArea),
        [STRINGS.USAGE_ACREAGE]: NumberUtils.numberToString(capetAreas),
        [STRINGS.NUMBER_OF_FLOOR]: NumberUtils.numberToString(numberOfFloor, '1'),
        [STRINGS.NUMBER_OF_BATHROOM]: NumberUtils.numberToString(numberOfBathrooms, '1'),
        [STRINGS.NUMBER_OF_BEDROOM]: NumberUtils.numberToString(numberOfBedrooms, '1'),
      };
    case PropertyType.land:
      return {
        ...widthLength,
        ...location,
        [STRINGS.LAND_ACREAGE]: NumberUtils.numberToString(buildingArea),
      };
    default:
      return {};
  }
};

const mapPropertyDetailToUi = (propertyDetail, propertyType) => {
  const {propertyPostStatusId, legalInfoId, direction} = propertyDetail;
  const uiModal = {
    [STRINGS.PROPERTY_STATUS]: propertyPostStatusId ?? '',
    [STRINGS.LEGAL_STATUS]: legalInfoId ?? '',
    [STRINGS.DIRECTION]: direction ?? '',
  };
  const specificModal = modalByType(propertyType, propertyDetail);
  return {...uiModal, ...specificModal};
};

const mappingByType = (type, propertyDetail) => {
  switch (type) {
    case PropertyType.apartment:
      return {
        [STRINGS.TOWER]: propertyDetail?.[STRINGS.TOWER] ?? '',
        [STRINGS.FLOOR]: propertyDetail?.[STRINGS.FLOOR] ?? '',
        [STRINGS.LAND_ACREAGE]: propertyDetail?.[STRINGS.LAND_ACREAGE] ?? '',
        [STRINGS.NUMBER_OF_BATHROOM]: propertyDetail?.[STRINGS.NUMBER_OF_BATHROOM] ?? 1,
        [STRINGS.NUMBER_OF_BEDROOM]: propertyDetail?.[STRINGS.NUMBER_OF_BEDROOM] ?? 1,
        [STRINGS.BALCONY_DIRECTION]: propertyDetail?.[STRINGS.BALCONY_DIRECTION] ?? '', // Hướng ban công
      };
    case PropertyType.villa:
    case PropertyType.house:
      return {
        [STRINGS.LAND_ACREAGE]: propertyDetail?.[STRINGS.LAND_ACREAGE] ?? '',
        [STRINGS.USAGE_ACREAGE]: propertyDetail?.[STRINGS.USAGE_ACREAGE] ?? '',
        [STRINGS.NUMBER_OF_FLOOR]: propertyDetail?.[STRINGS.NUMBER_OF_FLOOR] ?? 1,
        [STRINGS.NUMBER_OF_BATHROOM]: propertyDetail?.[STRINGS.NUMBER_OF_BATHROOM] ?? 1,
        [STRINGS.NUMBER_OF_BEDROOM]: propertyDetail?.[STRINGS.NUMBER_OF_BEDROOM] ?? 1,
        propertyLocation: propertyDetail?.propertyLocation ?? null,
        alleyWidth: propertyDetail?.alleyWidth ?? null,
      };
    case PropertyType.land:
      return {
        [STRINGS.LAND_ACREAGE]: propertyDetail?.[STRINGS.LAND_ACREAGE] ?? '',
        propertyLocation: propertyDetail?.propertyLocation ?? null,
        alleyWidth: propertyDetail?.alleyWidth ?? null,
      };
    default:
      return {};
  }
};

const mapPropertyDetailUiToUi = (propertyDetail, propertyType) => {
  const uiModel = {
    [STRINGS.PROPERTY_STATUS]: propertyDetail?.[STRINGS.PROPERTY_STATUS] ?? '',
    [STRINGS.LEGAL_STATUS]: propertyDetail?.[STRINGS.LEGAL_STATUS] ?? '',
    [STRINGS.WIDTH]: propertyDetail?.[STRINGS.WIDTH] ?? '',
    [STRINGS.LENGTH]: propertyDetail?.[STRINGS.LENGTH] ?? '',
    [STRINGS.DIRECTION]: propertyDetail?.[STRINGS.DIRECTION] ?? '',
  };
  const propertyDetailByType = mappingByType(propertyType, propertyDetail);
  return {...uiModel, ...propertyDetailByType};
};

const initialDetailStateByPropertyType = (draftData, type) => {
  if (!isEmpty(draftData)) {
    return mapPropertyDetailUiToUi(draftData, type);
  }
  switch (type) {
    case PropertyType.apartment:
      return InitialState.apartmentData;
    case PropertyType.house:
      return InitialState.houseData;
    case PropertyType.land:
      return InitialState.landData;
    case PropertyType.villa:
      return InitialState.villaData;
    default:
      return InitialState.apartmentData;
  }
};

/**
 * Map list facility UI to old model with distance (display mode)
 * @param {*} facilities
 * @param {*} isInternal internal facilities or near facilities
 * @returns facilities (display mode)
 */
const mapFacilityList = ({facilities = [], isInternal = false}) => {
  let result = [];
  if (ArrayUtils.hasArrayData(facilities)) {
    const filterFacilities = facilities.filter(e => e.checked);
    if (isInternal) {
      result = filterFacilities.map(item => ({name: item.name}));
    } else {
      result = filterFacilities.map(item => ({name: item.name, distance: item?.distance ?? ''}));
    }
  }
  return result;
};

export default {
  mapToDropdownData,
  mapUiToPropertyDetail,
  mapPropertyDetailToUi,
  initialDetailStateByPropertyType,
  mapFacilityList,
};
