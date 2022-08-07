import React, {useContext, useEffect, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useGetDistrictsByCityIdLazyQuery} from '../api/graphql/generated/graphql';
import {AppContext} from '../appData/appContext/useAppContext';
import {FETCH_POLICY, GLOBAL_ACTIONS, NAVIGATION_ANIMATION_DURATION} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images/index';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {commonStyles} from '../assets/theme/styles';
import {callAfterInteraction} from '../screens/commonHooks';
import AreaUtils from '../utils/AreaUtils';
import DropdownWithTitle from './DropdownWithTitle';

const styles = StyleSheet.create({
  warpperButton: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 31,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderStyle: 'dashed',
    borderColor: COLORS.PRIMARY_A100,
  },
  icAddSquare: {width: 13, height: 13},
  text: {
    fontSize: 12,
    color: COLORS.PRIMARY_A100,
    marginLeft: 9,
  },
  hidenView: {height: 0, overflow: 'hidden'},
});
const mapDistricts = data => {
  return data.districts.edges.map(item => ({
    id: item.districtId,
    name: item.districtName,
  }));
};

const useWorkingAreas = ({state, dispatch, cities}) => {
  const {showErrorAlert} = useContext(AppContext);
  const selectCityRef = useRef();
  const selectDistrictRef = useRef();
  const [dropdownCities, setDropdownCities] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [selectedCity, setSelectedCity] = React.useState({});
  const [loadingDistrictText, setLoadingDistrictText] = React.useState(
    translate(STRINGS.DO_NOT_HAVE_DATA),
  );
  const rawCities = cities.map(item => ({
    id: item.id,
    name: item.name,
  }));

  const [getDistricts, {loading: loadingDistricts, data: districtsData}] =
    useGetDistrictsByCityIdLazyQuery({
      ...FETCH_POLICY.NETWORK_ONLY,
    });
  useEffect(() => {
    if (loadingDistricts === true) {
      setLoadingDistrictText(translate(STRINGS.SEARCHING));
    } else {
      setLoadingDistrictText(translate(STRINGS.DO_NOT_HAVE_DATA));
    }
  }, [loadingDistricts]);

  useEffect(() => {
    setDropdownCities(cities);
  }, [cities]);

  useEffect(() => {
    if (districtsData) {
      setDistricts(mapDistricts(districtsData));
    }
  }, [districtsData]);
  const onSelectCity = item => {
    setDistricts([]);
    if (!item) {
      return;
    }
    setSelectedCity(item);
    getDistricts({variables: {where: {cityId: item.id}}});
    callAfterInteraction(onpenModalDistric);
  };

  const onpenModalCity = () => {
    selectCityRef.current?.showModal();
  };

  const onpenModalDistric = () => {
    selectDistrictRef.current?.showModal();
  };

  const onSelectDistrict = item => {
    if (!item) {
      return;
    }
    const workingArea = {
      city: {
        id: selectedCity.id,
        name: selectedCity.name,
      },
      district: {
        id: item.id,
        name: item.name,
      },
      id: state.workingAreas.length,
    };
    const error = AreaUtils.checkErrorAreaInList(state.workingAreas, workingArea);
    if (error) {
      setTimeout(function () {
        showErrorAlert(error);
      }, NAVIGATION_ANIMATION_DURATION * 2);
    } else {
      dispatch({type: GLOBAL_ACTIONS.INSERT_WORKING_AREA, payload: workingArea});
    }

    setDropdownCities(rawCities);
    setSelectedCity({});
    setDistricts([]);
  };

  const props = {
    dropdownCities,
    onSelectCity,
    state,
    districts,
    onSelectDistrict,
    loadingDistrictText,
    selectedCity,
    selectCityRef,
    selectDistrictRef,
    onpenModalCity,
  };

  return props;
};

const WorkingAreas = ({state, dispatch, cities}) => {
  const data = useWorkingAreas({state, dispatch, cities});
  return <WorkingAreaView {...data} />;
};

export default WorkingAreas;
export const WorkingAreaView = ({
  dropdownCities,
  onSelectCity,
  state = {},
  districts,
  onSelectDistrict,
  loadingDistrictText,
  selectedCity,
  selectCityRef,
  selectDistrictRef,
  onpenModalCity,
}) => {
  return (
    <View>
      <View style={styles.hidenView}>
        <DropdownWithTitle
          ref={selectCityRef}
          title=""
          dropdownTitle={translate(STRINGS.PROVINCE)}
          popupTitle={translate(STRINGS.PROVINCE)}
          items={dropdownCities}
          error=""
          inputStyle={commonStyles.inputBorder}
          onChosen={onSelectCity}
          showSearchBox={true}
          disabled={state.workingAreas?.length >= 4}
        />
        <DropdownWithTitle
          ref={selectDistrictRef}
          title=""
          dropdownTitle={translate(STRINGS.DISTRICT)}
          popupTitle={translate(STRINGS.DISTRICT)}
          items={districts}
          inputStyle={commonStyles.inputBorder}
          error=""
          onChosen={onSelectDistrict}
          emptyText={loadingDistrictText}
          showSearchBox={true}
          disabled={selectedCity?.id ? false : true}
        />
      </View>
      {state.workingAreas?.length < 4 && (
        <View style={styles.warpperButton}>
          <TouchableOpacity style={styles.button} onPress={onpenModalCity}>
            <Image source={IMAGES.IC_ADD_SQUARE} style={styles.icAddSquare} resizeMode="contain" />
            <Text style={styles.text}>{translate('common.addArea')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
