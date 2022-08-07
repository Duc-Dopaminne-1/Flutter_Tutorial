import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {FONTS} from '../../../assets/theme/fonts';
import DropdownCities from '../../../components/DropdownCities';
import DropdownDistricts from '../../../components/DropdownDistricts';

const styles = StyleSheet.create({
  viewContainer: {},
  text: {
    fontSize: 15,
    ...FONTS.bold,
    marginTop: 16,
  },
});

const FilterAgentLocation = ({state, onChangeCity, onChangeDistrict}) => {
  const cityId = state.place?.cityId;
  return (
    <View style={styles.viewContainer}>
      <Text style={styles.text}>{translate(STRINGS.INTERESTED_AREA)}</Text>
      <DropdownCities
        selectedId={cityId}
        isReset={state.isResetCity}
        isHavingAll={true}
        onChangeCity={onChangeCity}
        placeholder={translate(STRINGS.PROVINCE)}
        isRequiredAtLeastOne={true}
        setDefaultFirst={false}
        disabled={state.findNearest}
      />
      <DropdownDistricts
        selectedIds={state?.place?.districtId}
        onChangeDistrict={onChangeDistrict}
        cityId={cityId}
        isSelectSingle={false}
        isHaveAll={true}
        placeholder={translate(STRINGS.DISTRICT)}
        isRequiredAtLeastOne={true}
        setDefaultFirst={false}
        disabled={state.findNearest}
        isReset={state.isResetCity}
      />
    </View>
  );
};

export default FilterAgentLocation;
