/* eslint-disable react-hooks/exhaustive-deps */
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

const CitiesDistrictsWardsContact = ({cities, state, dispatch, errors = {}}) => {
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);
  const [selectedCity, setSelectedCity] = React.useState(state.contactAddress?.city);
  const [selectedDistrict, setSelectedDistrict] = React.useState(state.contactAddress?.district);
  const [selectedWard, setSelectedWard] = React.useState(state.contactAddress?.ward);
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
    if (state?.contactAddress) {
      setSelectedCity(state.contactAddress?.city);
      setSelectedDistrict(state.contactAddress?.district);
      setSelectedWard(state.contactAddress?.ward);
    } else if (state?.contactAddress === '') {
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedWard('');
    }
  }, [state?.contactAddress]);

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
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_CITY, payload: item});
      setSelectedDistrict({});
      setSelectedWard({});
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_DISTRICT, payload: {}});
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD, payload: {}});
      getDistricts();
    }
  };

  const onSelectDistrict = item => {
    if (item) {
      setSelectedDistrict(item);
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_DISTRICT, payload: item});
      setSelectedWard({});
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD, payload: {}});
      setIsExecuteWard(false);
      getWards();
    }
  };

  const onSelectWard = item => {
    if (item) {
      setSelectedWard(item);
      dispatch({type: GLOBAL_ACTIONS.SET_CONTACT_ADDRESS_WARD, payload: item});
    }
  };

  return (
    <>
      <DropdownWithTitle
        title={translate(STRINGS.PROVINCE)}
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.PROVINCE)}
        items={cities}
        inputStyle={commonStyles.inputBorder}
        error={errors?.errContactCity}
        onChosen={onSelectCity}
        showSearchBox={true}
        isRequiredAtLeastOne={true}
        placeholder={translate('common.placeholders.city')}
      />
      <DropdownWithTitle
        title={translate(STRINGS.DISTRICT)}
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.DISTRICT)}
        inputStyle={commonStyles.inputBorder}
        items={districts}
        error={errors?.errContactDistrict}
        onChosen={onSelectDistrict}
        emptyText={loadingText}
        showSearchBox={true}
        disabled={shouldDisableDropdown(selectedCity)}
        isRequiredAtLeastOne={true}
        placeholder={translate('common.placeholders.district')}
      />
      <DropdownWithTitle
        title={translate(STRINGS.WARD)}
        style={{marginTop: normal}}
        popupTitle={translate(STRINGS.WARD)}
        inputStyle={commonStyles.inputBorder}
        items={wards}
        error={errors?.errerrContactWard}
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

export default CitiesDistrictsWardsContact;
