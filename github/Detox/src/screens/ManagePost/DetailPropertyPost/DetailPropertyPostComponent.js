import findIndex from 'lodash/findIndex';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {FACILITY_TYPE, GLOBAL_ACTIONS, MAX_LENGTH} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import AddFacilityComponent from '../FacilityFurniture/AddFacilityComponent';
import PropertyType from '../PropertyType';
import ApartmentInfo from './ApartmentInfo';
import BasePropertyInfo from './BasePropertyInfo';
import {BottomInfo} from './BottomInfo';
import LocationInfo from './LocationInfo';

const defaultDropdownData = {
  propertyStatus: [],
  directions: [],
  balconyDirections: [],
  legalStatus: [],
};

const DetailPropertyPostComponent = ({dispatch, state, showPopup = () => {}}) => {
  const [dropDownData, setDropDownData] = useState(defaultDropdownData);
  const type = state?.propertyTypeName ?? PropertyType.apartment;
  const onDataDetailChange = data => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_PROPERTY_DETAIL, payload: data});
  };

  useEffect(() => {
    if (state?.detailInfo?.dropdownData) {
      setDropDownData(state?.detailInfo?.dropdownData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.detailInfo]);

  const onComponentChange = item => {
    if (item) {
      const key = Object.keys(item)[0];
      const refreshErrors = {...state?.detailInfo?.errors, ...{[key]: ''}};
      onDataDetailChange({...state?.detailInfo, ...item, ...{errors: refreshErrors}});
    }
  };

  const onChangeAlleyWidth = alleyWidth => {
    onComponentChange({alleyWidth});
  };

  const onChangePropertyLocation = propertyLocation => {
    onComponentChange({propertyLocation});
  };

  const onDeleteItemNear = item => {
    const items = state?.buildingFacility?.nearFacility;
    const newArr = [...items];
    const index = findIndex(items, {id: item.id});
    newArr[index].checked = false;
    const input = {nearFacility: newArr};
    dispatch({type: GLOBAL_ACTIONS.UPDATE_BUILDING_FACILITY, payload: input});
  };

  const onDeleteItemFurniture = item => {
    const items = state?.buildingFacility?.internalFacility;
    const newArr = [...items];
    const index = findIndex(items, {id: item.id});
    newArr[index].checked = false;
    const input = {internalFacility: newArr};
    dispatch({type: GLOBAL_ACTIONS.UPDATE_BUILDING_FACILITY, payload: input});
  };

  return (
    <View>
      {type === PropertyType.apartment ? (
        <ApartmentInfo
          state={state?.detailInfo}
          houseDirections={dropDownData.directions}
          balconyDirections={dropDownData.balconyDirections}
          onComponentChange={onComponentChange}
        />
      ) : (
        <BasePropertyInfo
          state={state?.detailInfo}
          onComponentChange={onComponentChange}
          propertyType={type}
          houseDirections={dropDownData.directions}
        />
      )}

      <BottomInfo
        state={{
          PROPERTY_STATUS: state?.detailInfo?.PROPERTY_STATUS,
          LEGAL_STATUS: state?.detailInfo?.LEGAL_STATUS,
        }}
        onComponentChange={onComponentChange}
        legalStatus={dropDownData?.legalStatus}
        propertyStatus={dropDownData?.propertyStatus}
      />
      {type !== PropertyType.apartment && (
        <LocationInfo
          locationId={state.detailInfo?.propertyLocation}
          alleyWidth={state.detailInfo?.alleyWidth}
          onInputText={onChangeAlleyWidth}
          onSelect={onChangePropertyLocation}
          locationError={state.detailInfo?.errors?.propertyLocation}
          alleyWidthError={state.detailInfo?.errors?.alleyWidth}
        />
      )}

      <AddFacilityComponent
        state={state}
        dispatch={dispatch}
        title={translate(STRINGS.NEARBY_FACILITY_LIMITED)}
        textButtonAdd={translate(STRINGS.ADD_FACILITY)}
        limitNumber={MAX_LENGTH.MAX_FACILITIES}
        facilityType={FACILITY_TYPE.NEARBY}
        showPopup={showPopup}
        onDeleteItem={onDeleteItemNear}
      />

      {type !== PropertyType.land && (
        <AddFacilityComponent
          state={state}
          dispatch={dispatch}
          title={translate(STRINGS.FURNITURE_LIMITED)}
          textButtonAdd={translate(STRINGS.ADD_FACILITY)}
          limitNumber={MAX_LENGTH.MAX_FACILITIES}
          facilityType={FACILITY_TYPE.FURNITURE}
          showPopup={showPopup}
          onDeleteItem={onDeleteItemFurniture}
        />
      )}
    </View>
  );
};

export default DetailPropertyPostComponent;
