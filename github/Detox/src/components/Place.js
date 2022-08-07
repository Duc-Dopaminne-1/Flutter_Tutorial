import React from 'react';

import {ALL_SELECT, GLOBAL_ACTIONS} from '../assets/constants';
import DropdownCities from './DropdownCities';
import DropdownDistricts from './DropdownDistricts';

const shouldDisableDistrict = ({selectedCity}) => {
  return !(selectedCity?.id && selectedCity?.id !== ALL_SELECT.id);
};

const Places = ({place, dispatch, errors, isSingleDistrict, ...props}) => {
  const [selectedPlace, setSelectedPlace] = React.useState(place);
  const [isResetCity, setResetCity] = React.useState(true);

  React.useEffect(() => {
    if (isResetCity) {
      setResetCity(false);
    }
  }, [isResetCity]);

  React.useEffect(() => {
    setSelectedPlace(place);
  }, [place, selectedPlace]);

  const onChangeCity = city => {
    if (!city) {
      return;
    }
    if (city.id !== selectedPlace?.city?.id) {
      setSelectedPlace({...selectedPlace, city});
      dispatch({
        type: GLOBAL_ACTIONS.CREATE_WORKING_AREA,
        payload: {...selectedPlace, city, districts: []},
      });
    }
  };

  const onChangeDistrict = districts => {
    setSelectedPlace({...selectedPlace, districts: isSingleDistrict ? [districts] : districts});
    dispatch({
      type: GLOBAL_ACTIONS.CREATE_WORKING_AREA,
      payload: {...selectedPlace, districts: isSingleDistrict ? [districts] : districts},
    });
  };

  const getDistrictsSelectedIds = () => {
    return selectedPlace?.districts?.map(district => ({id: district?.id}));
  };

  return (
    <>
      <DropdownCities
        onChangeCity={onChangeCity}
        isReset={isResetCity}
        selectedId={selectedPlace?.city?.id}
        setDefaultFirst={false}
        error={errors?.city}
        {...props}
      />
      <DropdownDistricts
        onChangeDistrict={onChangeDistrict}
        cityId={selectedPlace?.city?.id}
        isSelectSingle={!!isSingleDistrict}
        disabled={shouldDisableDistrict({selectedCity: selectedPlace?.city})}
        selectedIds={getDistrictsSelectedIds()}
        error={errors?.district}
        {...props}
      />
    </>
  );
};

export default Places;
