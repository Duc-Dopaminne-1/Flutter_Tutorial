import React, {forwardRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import CustomButton from '../../../components/Button/CustomButton';
import DropdownCities from '../../../components/DropdownCities';
import DropdownDistricts from '../../../components/DropdownDistricts';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';

const style = StyleSheet.create({
  title: {fontSize: 24, ...FONTS.bold},
  headerRadio: {marginBottom: small, marginTop: 32, color: COLORS.TEXT_DARK_10},
  btnApply: {
    height: 50,
    borderRadius: small,
    flex: 1,
    marginLeft: normal,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  btnReset: {height: 50, borderRadius: small, flex: 1, backgroundColor: COLORS.GRAY_BD},
  viewBottom: {flexDirection: 'row', marginVertical: normal},
  inputDropdown: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_ED},
});

const ModalFilterConsultant = forwardRef(({applyFilterConsultant, initState, filterData}, ref) => {
  const [filterState, setFilterState] = useState(filterData);

  const onChangeFilter = (key, value) => {
    setFilterState({...filterState, [key]: value});
  };
  const applyFilter = () => {
    applyFilterConsultant(filterState);
    ref.current.close();
  };

  const onReset = () => {
    setFilterState(initState);
  };

  return (
    <ModalWithModalize withReactModal={Platform.OS === 'ios'} getModalRef={ref}>
      <View style={{padding: normal}}>
        <Text style={style.title}>{translate('social.modalSort.filter')}</Text>
        <Text style={{marginTop: normal}}>{translate(STRINGS.AREA)}</Text>
        <DropdownCities
          onChangeCity={e => onChangeFilter('cityId', e?.id)}
          isRequired
          inputStyle={style.inputDropdown}
          selectedId={filterState?.cityId}
          style={{...HELPERS.fill}}
        />
        <DropdownDistricts
          isRequired
          placeholder={translate(STRINGS.DISTRICT)}
          cityId={filterState?.cityId}
          isHaveAll
          isSelectSingle={false}
          inputStyle={style.inputDropdown}
          selectedIds={filterState?.districtId}
          onChangeDistrict={e => onChangeFilter('districtId', e)}
          isRequiredAtLeastOne={true}
        />
        <View style={style.viewBottom}>
          <CustomButton
            style={style.btnReset}
            title={translate('social.modalSort.reset')}
            onPress={onReset}
          />
          <CustomButton
            style={style.btnApply}
            onPress={applyFilter}
            title={translate('social.modalSort.apply')}
          />
        </View>
      </View>
    </ModalWithModalize>
  );
});

export default ModalFilterConsultant;
