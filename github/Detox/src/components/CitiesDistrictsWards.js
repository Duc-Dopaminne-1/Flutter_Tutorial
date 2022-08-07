/* eslint-disable react-hooks/exhaustive-deps */
import isEmpty from 'lodash/isEmpty';
import React, {useEffect} from 'react';

import {
  useGetDistrictsByCityIdLazyQuery,
  useGetWardByDistrictIdLazyQuery,
} from '../api/graphql/generated/graphql';
import {GLOBAL_ACTIONS} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {normal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {callAfterInteraction} from '../screens/commonHooks';
import DropdownWithTitle from './DropdownWithTitle';

const mapDistricts = (data, selectedDistrict) => {
  return data?.districts?.edges?.map(item => ({
    id: item.districtId,
    name: item.districtName,
    checked: item.districtId === selectedDistrict?.id ? true : false,
  }));
};

const mapWards = (data, selectedWard) => {
  return data?.wards?.edges?.map(item => ({
    id: item.wardId,
    name: item.wardName,
    checked: item.wardId === selectedWard?.id ? true : false,
  }));
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

const getWardsQuery = (query, districtId) => {
  return query({
    variables: {
      where: {
        districtId: districtId?.id ? districtId?.id : 0,
      },
    },
  });
};

const getLoadingText = (loadingDistricts, loadingWards) => {
  const stringKey = loadingDistricts || loadingWards ? STRINGS.SEARCHING : STRINGS.DO_NOT_HAVE_DATA;
  return translate(stringKey);
};

const shouldDisableDropdown = data => {
  return data?.id ? false : true;
};

const CitiesDistrictsWards = ({cities, state, dispatch, errors = {}}) => {
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);
  const [selectedCity, setSelectedCity] = React.useState(state.permanentAddress?.city);
  const [selectedDistrict, setSelectedDistrict] = React.useState(state.permanentAddress?.district);
  const [selectedWard, setSelectedWard] = React.useState(state.permanentAddress?.ward);
  const [isExecuteDistrict, setIsExecuteDistrict] = React.useState(false);
  const [isExecuteWard, setIsExecuteWard] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState(translate(STRINGS.DO_NOT_HAVE_DATA));

  const [getDistricts, {loading: loadingDistricts, data: districtsData}] = getDistrictsQuery(
    useGetDistrictsByCityIdLazyQuery,
    selectedCity,
  );
  const [getWards, {loading: loadingWards, data: wardsData}] = getWardsQuery(
    useGetWardByDistrictIdLazyQuery,
    selectedDistrict,
  );

  useEffect(() => {
    if (state?.permanentAddress) {
      setSelectedCity(state.permanentAddress?.city);
      setSelectedDistrict(state.permanentAddress?.district);
      setSelectedWard(state.permanentAddress?.ward);
    } else if (isEmpty(state?.permanentAddress)) {
      setSelectedCity({});
      setSelectedDistrict({});
      setSelectedWard({});
    }
  }, [state?.permanentAddress]);

  useEffect(() => {
    if (selectedCity?.id) {
      setIsExecuteDistrict(false);
      getDistricts();
    }
    if (selectedDistrict?.id) {
      setIsExecuteWard(false);
      getWards();
    } else {
      setWards([]);
      setDistricts([]);
    }
  }, [selectedCity, selectedDistrict]);

  useEffect(() => {
    const loadingTextTemp = getLoadingText(loadingDistricts, loadingWards);
    setLoadingText(loadingTextTemp);
  }, [loadingDistricts, loadingWards]);
  useEffect(() => {
    callAfterInteraction(() => {
      if (districtsData && !isExecuteDistrict) {
        setIsExecuteDistrict(true);
        setDistricts(mapDistricts(districtsData, selectedDistrict));
      }
      if (wardsData && !isExecuteWard) {
        setIsExecuteWard(true);
        setWards(mapWards(wardsData, selectedWard));
      }
    });
  }, [districtsData, wardsData, isExecuteDistrict, isExecuteWard]);

  const onSelectCity = item => {
    setDistricts([]);
    setWards([]);
    if (item) {
      setIsExecuteDistrict(false);
      setSelectedCity(item);
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_CITY, payload: item});
      setSelectedDistrict({});
      setSelectedWard({});
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_DISTRICT, payload: {}});
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_WARD, payload: {}});
      getDistricts();
    }
  };
  const onSelectDistrict = item => {
    if (item) {
      setSelectedDistrict(item);
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_DISTRICT, payload: item});
      setSelectedWard({});
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_WARD, payload: {}});
      setIsExecuteWard(false);
      getWards();
    }
  };
  const onSelectWard = item => {
    if (item) {
      setSelectedWard(item);
      dispatch({type: GLOBAL_ACTIONS.SET_ADDRESS_WARD, payload: item});
    }
  };
  return (
    <>
      <DropdownWithTitle
        isRequired
        title="Tỉnh/Thành phố"
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.PROVINCE)}
        items={cities}
        inputStyle={commonStyles.inputBorder}
        error={errors?.errCity}
        onChosen={onSelectCity}
        showSearchBox={true}
        isRequiredAtLeastOne={true}
        placeholder={translate('common.placeholders.city')}
      />
      <DropdownWithTitle
        isRequired
        title="Quận/Huyện"
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.DISTRICT)}
        inputStyle={commonStyles.inputBorder}
        items={districts}
        error={errors?.errDistrict}
        onChosen={onSelectDistrict}
        emptyText={loadingText}
        showSearchBox={true}
        disabled={shouldDisableDropdown(selectedCity)}
        isRequiredAtLeastOne={true}
        placeholder={translate('common.placeholders.district')}
      />
      <DropdownWithTitle
        isRequired
        title="Phường/Xã"
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.WARD)}
        inputStyle={commonStyles.inputBorder}
        items={wards}
        error={errors?.errWard}
        onChosen={onSelectWard}
        emptyText={loadingText}
        showSearchBox={true}
        disabled={shouldDisableDropdown(selectedDistrict)}
        isRequiredAtLeastOne={true}
        placeholder={translate('common.placeholders.ward')}
      />
    </>
  );
};

export default CitiesDistrictsWards;
