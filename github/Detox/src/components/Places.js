import findIndex from 'lodash/findIndex';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {ALL_SELECT, GLOBAL_ACTIONS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import AreaUtils from '../utils/AreaUtils';
import SearchDataUtils from '../utils/SearchDataUtils';
import {selectedAreaDisplayText} from '../utils/UserAgentUtil';
import DropdownCities from './DropdownCities';
import DropdownDistricts from './DropdownDistricts';

const styles = StyleSheet.create({
  selectedAreaContainer: {
    marginTop: 8,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    minHeight: 52,
    flexWrap: 'wrap',
  },
  selectedAreaItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.MARGIN_8,
    marginVertical: 6,
    height: 28,
    borderRadius: SIZES.BORDER_RADIUS_20,
    backgroundColor: COLORS.SELECTED_AREA,
  },
  area: {
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
  },
  areaText: {...FONTS.regular, fontSize: 12},
});

const renderSelectedAreas = ({item, index, areas, dispatch}) => {
  const removeArea = () => {
    if (index < areas.length) {
      dispatch({type: GLOBAL_ACTIONS.REMOVE_WORKING_AREA, payload: areas[index]});
    }
  };

  return (
    <View key={index} style={styles.selectedAreaItem}>
      <View style={styles.area}>
        <Text style={styles.areaText} numberOfLines={2}>
          {selectedAreaDisplayText(item)}
        </Text>
      </View>
      <IconButton
        icon="close-box-outline"
        color={COLORS.TEXT_DARK_40}
        size={20}
        onPress={removeArea}
      />
    </View>
  );
};

const getWorkingArea = ({selectedCity, districts, areas}) => {
  const workingArea = {
    city: {
      id: selectedCity.id,
      name: selectedCity.name,
    },
    districts: districts,
    id: areas.length,
  };
  return workingArea;
};

const shouldDisableDistrict = ({selectedCity}) => {
  return !(selectedCity.id && selectedCity.id !== ALL_SELECT.id);
};

const checkAndDispatchDistrict = ({areas, workingArea, dispatch}) => {
  const areasHasCityAll = SearchDataUtils.checkAreaHasCityAll(areas);
  const error = AreaUtils.checkErrorCityInList(areas, workingArea);
  if (error) {
    dispatch({type: GLOBAL_ACTIONS.INSERT_EXIST_CITY, payload: workingArea});
  } else if (!areasHasCityAll) {
    dispatch({type: GLOBAL_ACTIONS.INSERT_WORKING_AREA, payload: workingArea});
  } else {
    dispatch({type: GLOBAL_ACTIONS.CREATE_WORKING_AREA, payload: workingArea});
  }
};

const Places = ({areas, dispatch}) => {
  const [selectedCity, setSelectedCity] = React.useState({id: 0});
  const [resetCities, setResetCities] = React.useState(false);
  const [selectedDistricts, setSelectedDistricts] = React.useState([]);

  useEffect(() => {
    if (resetCities) {
      setResetCities(false);
    }
  }, [resetCities]);

  useEffect(() => {
    // reset dropdown when reset
    if (areas.length < 1) {
      setSelectedCity({});
      setResetCities(true);
      setSelectedDistricts([]);
    }
  }, [areas]);

  const onChangeCity = city => {
    if (!city) {
      return;
    }
    if (city.id === ALL_SELECT.id) {
      setSelectedCity(city);
      setSelectedDistricts([]);
      setResetCities(true);
      const workingArea = getWorkingArea({selectedCity: city, districts: [], areas});
      dispatch({type: GLOBAL_ACTIONS.CREATE_WORKING_AREA, payload: workingArea});
      return;
    }
    let isExist = false;
    for (const eCity of areas) {
      if (eCity.city.id === city.id) {
        isExist = true;
        setSelectedDistricts(eCity.districts);
        break;
      }
    }
    if (!isExist) {
      setSelectedDistricts([]);
    }
    const workingArea = getWorkingArea({selectedCity: city, districts: [], areas});
    checkAndDispatchDistrict({areas, workingArea, dispatch});
    setSelectedCity(city);
  };

  const onChangeDistrict = districts => {
    let workingArea = getWorkingArea({selectedCity, districts, areas});
    const index = findIndex(districts, {id: -1});
    if (index !== -1) {
      workingArea = {...workingArea, districts: []};
    }
    checkAndDispatchDistrict({areas, workingArea, dispatch});
    setResetCities(true);
    setSelectedCity({});
  };

  return (
    <View>
      <DropdownCities
        onChangeCity={onChangeCity}
        isReset={resetCities}
        isRequiredAtLeastOne={true}
        isHavingAll={true}
      />
      <DropdownDistricts
        onChangeDistrict={onChangeDistrict}
        cityId={selectedCity?.id}
        isSelectSingle={false}
        isHaveAll={true}
        disabled={shouldDisableDistrict({selectedCity})}
        selectedIds={selectedDistricts}
        removeDelete={true}
      />
      {!!areas?.length && (
        <View style={styles.selectedAreaContainer}>
          {areas?.map((item, index) => renderSelectedAreas({item, index, areas, dispatch}))}
        </View>
      )}
    </View>
  );
};

export default Places;
