import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useGetDistrictsByCityIdLazyQuery} from '../../../../api/graphql/generated/graphql';
import {AppContext} from '../../../../appData/appContext/useAppContext';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {commonStyles} from '../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import {callAfterInteraction, useMount} from '../../../../screens/commonHooks';

const styles = StyleSheet.create({
  dropdownIconStyle: {
    color: COLORS.TEXT_DARK_10,
  },
});

const mapDistricts = (data, selectedDistrict) => {
  return data?.districts?.edges?.map(item => ({
    id: item.districtId,
    name: item.districtName,
    checked: item.districtId === selectedDistrict?.id ? true : false,
  }));
};

const mapItems = (data, selectedCity) => {
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    checked: item.id === selectedCity?.id ? true : false,
  }));
};
const getLoadingText = loadingDistricts => {
  const stringKey = loadingDistricts ? STRINGS.SEARCHING : STRINGS.DO_NOT_HAVE_DATA;
  return translate(stringKey);
};
const shouldDisableDropdown = data => {
  return data?.id ? false : true;
};
const getCities = (data, city) => {
  return data?.cities?.edges
    ? data.cities.edges.map(item => ({
        id: item.cityId,
        name: item.cityName,
        checked: item.cityId === city?.id ? true : false,
      }))
    : [];
};
const getDistrictsQuery = (query, city) => {
  return query({
    variables: {
      where: {
        cityId: city?.id ? city.id : 0,
      },
    },
  });
};
const SelectCitiesAndDistrictView = ({
  onSelectedCity = () => {},
  onSelectedDistrict = () => {},
  cityValidationErrorCode = '',
  districtValidationErrorCode = '',
  defaultCity = null,
  defaultDistrict = null,
}) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [chosenCity, setChosenCity] = useState({});
  const [chosenDistrict, setChosenDistrict] = useState({});
  const [isExecuteDistrict, setIsExecuteDistrict] = useState(false);
  const {getMasterData} = useContext(AppContext);
  const [getDistricts, {loading: loadingDistricts, data: districtsData}] = getDistrictsQuery(
    useGetDistrictsByCityIdLazyQuery,
    chosenCity,
  );
  const [loadingText, setLoadingText] = React.useState(translate(STRINGS.DO_NOT_HAVE_DATA));
  const updateCityAndDistrictData = () => {
    setChosenDistrict(defaultDistrict);
    setChosenCity(defaultCity);
    setCities(mapItems(cities, defaultCity));
    getDistricts();
  };
  // Set default value
  useEffect(updateCityAndDistrictData, [defaultCity, defaultDistrict]);
  // ************

  // Load initial cities and districts
  const loadCitiesDistricts = () => {
    const masterData = getMasterData();
    if (masterData) {
      setCities(getCities(masterData, {}));
    }
  };
  const loadData = () => {
    loadCitiesDistricts();
  };
  // ***********
  const onChangeDistrict = () => {
    if (!loadingDistricts && districtsData) {
      setDistricts(mapDistricts(districtsData, chosenDistrict));
    }
  };

  const onLoadDistrict = () => {
    const loadingTextTemp = getLoadingText(loadingDistricts);
    setLoadingText(loadingTextTemp);
  };

  const onDoneChosenDistrict = () => {
    callAfterInteraction(() => {
      if (districtsData && !isExecuteDistrict) {
        setIsExecuteDistrict(true);
        setDistricts(mapDistricts(districtsData, chosenDistrict));
      }
    });
  };
  useEffect(onDoneChosenDistrict, [districtsData, chosenDistrict, isExecuteDistrict]);
  useEffect(onLoadDistrict, [loadingDistricts]);
  useEffect(onChangeDistrict, [districtsData, chosenDistrict]);

  useMount(loadData);

  const onChosenCity = item => {
    if (item) {
      setIsExecuteDistrict(false);
      setChosenCity(item);
      onSelectedCity(item);
      // Reset the chosen district
      setChosenDistrict({});
      // Reset the district list of the according city
      setDistricts([]);
      getDistricts();
    }
  };
  const onChosenDistrict = item => {
    if (item) {
      setChosenDistrict(item);
      onSelectedDistrict(item);
    }
  };
  return (
    <>
      <DropdownWithTitle
        inputStyle={commonStyles.dropdownInput}
        headerStyles={commonStyles.dropdownHeader}
        title={translate(STRINGS.SELECT_INTERESTED_NEIGHBORHOOD)}
        dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
        dropdownTitle={translate(STRINGS.PROVINCE)}
        popupTitle={translate(STRINGS.PROVINCE)}
        items={cities}
        showSearchBox
        error={translate(cityValidationErrorCode)}
        isRequired
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenCity}
        isRequiredAtLeastOne
        emptyText={loadingText}
      />
      <DropdownWithTitle
        inputStyle={
          shouldDisableDropdown(chosenCity)
            ? {...commonStyles.dropdownDisabled}
            : {...commonStyles.dropdownInput}
        }
        dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
        dropdownTitle={translate(STRINGS.DISTRICT)}
        popupTitle={translate(STRINGS.DISTRICT)}
        items={districts}
        showSearchBox
        error={translate(districtValidationErrorCode)}
        disabled={shouldDisableDropdown(chosenCity)}
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenDistrict}
        isRequiredAtLeastOne
        emptyText={loadingText}
        dropdownIconStyle={styles.dropdownIconStyle}
      />
    </>
  );
};

export default SelectCitiesAndDistrictView;
