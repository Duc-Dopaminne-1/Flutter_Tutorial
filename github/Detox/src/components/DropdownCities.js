import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {ViewPropTypes} from 'react-native';

import {useGetAllCitiesLazyQuery} from '../api/graphql/generated/graphql';
import {ALL_SELECT, CONSTANTS, FETCH_POLICY} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {useMount} from '../screens/commonHooks';
import DropdownWithTitle from './DropdownWithTitle';

const mapCities = (data, selectedCityId) => {
  const cities = data?.cities?.edges;
  if (!cities || !Array.isArray(cities)) {
    return [];
  }
  return cities.map(item => ({
    id: item.cityId,
    name: item.cityName,
    checked: item.cityId === selectedCityId ? true : false,
  }));
};

const DropdownCities = ({
  selectedId,
  onChangeCity,
  style,
  error,
  isReset,
  placeholder,
  isRequiredAtLeastOne,
  setDefaultFirst,
  showSearchBox,
  isRequired = false,
  disabled,
  isHavingAll,
  title,
  inputStyle,
  placeholderStyle,
  titleStyle,
  colorTheme = COLORS.PRIMARY_A100,
  selectedStyle,
  isSelectSingle,
}) => {
  const [cities, setCities] = useState([]);
  const [getCities, {data: citiesData}] = useGetAllCitiesLazyQuery({
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  useMount(getCities);

  const setCitiesData = () => {
    let listItems = mapCities(citiesData, null);
    if (isHavingAll) {
      listItems = [{...ALL_SELECT, checked: false}, ...listItems];
    }
    if (setDefaultFirst && listItems.length > 0) {
      listItems[0].checked = true;
      onChangeCity(listItems[0]);
    } else if (selectedId && isHavingAll) {
      listItems = mapCities(citiesData, selectedId);
      listItems = [{...ALL_SELECT, checked: false}, ...listItems];
    } else if (selectedId) {
      listItems = mapCities(citiesData, selectedId);
    }
    setCities(listItems);
  };

  useEffect(() => {
    if (isReset) {
      setCitiesData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset]);

  useEffect(() => {
    const listItems = mapCities(citiesData, selectedId);
    setCities(listItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    setCitiesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [citiesData]);

  const onSelectCity = item => {
    if (!item) {
      onChangeCity({
        id: CONSTANTS.DEFAULT_DROPDOWN_ID,
        name: CONSTANTS.DEFAULT_DROPDOWN_NAME,
        checked: true,
      });
    } else if (item.id !== selectedId) {
      onChangeCity(item);
    }
  };

  return (
    <DropdownWithTitle
      colorTheme={colorTheme}
      style={style}
      dropdownTitle={placeholder}
      popupTitle={translate(STRINGS.PROVINCE)}
      items={cities}
      isRequired={isRequired}
      title={title}
      headerStyles={titleStyle}
      inputStyle={inputStyle}
      onChosen={onSelectCity}
      error={error}
      isRequiredAtLeastOne={isRequiredAtLeastOne}
      showSearchBox={showSearchBox}
      isSelectSingle={isSelectSingle}
      disabled={disabled}
      isHaveAll={isHavingAll}
      dropdownPlaceHolderStyle={placeholderStyle}
      selectedStyle={selectedStyle}
    />
  );
};

DropdownCities.propTypes = {
  selectedId: PropTypes.number,
  onChangeCity: PropTypes.func,
  style: ViewPropTypes.style,
  error: PropTypes.string,
  isReset: PropTypes.bool,
  isSelectSingle: PropTypes.bool,
  placeholder: PropTypes.string,
  isRequiredAtLeastOne: PropTypes.bool,
  setDefaultFirst: PropTypes.bool,
  showSearchBox: PropTypes.bool,
  disabled: PropTypes.bool,
  isHavingAll: PropTypes.bool,
};

DropdownCities.defaultProps = {
  selectedId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  onChangeCity: () => {},
  style: {},
  error: '',
  isReset: false,
  isSelectSingle: true,
  placeholder: translate(STRINGS.PROVINCE),
  isRequiredAtLeastOne: false,
  setDefaultFirst: false,
  showSearchBox: true,
  disabled: false,
  isHavingAll: false,
};

export default DropdownCities;
