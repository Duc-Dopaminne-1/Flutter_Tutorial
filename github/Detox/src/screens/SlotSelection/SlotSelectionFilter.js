import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle} from 'react-native';

import {AQUARE_ARRAY, TRANSACTION_MODE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, normal, small, tiny} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';
import DropdownWithTitle from '../../components/DropdownWithTitle';
import {RangeInputSelect} from '../../components/RangeInputSelect';
import PropertyType from '../ManagePost/PropertyType';
import SlotSelectionUtil, {FilterComponentKey} from './SlotSelectionUtil';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fill,
    ...HELPERS.mainEnd,
    backgroundColor: COLORS.TRANSPARENT,
    marginHorizontal: normal,
    marginBottom: medium,
  },
  titleText: {
    ...FONTS.semiBold,
    marginTop: medium,
    fontSize: 22,
  },
  buttonContainer: {
    ...HELPERS.row,
    marginTop: medium,
  },
  titleSelect: {marginBottom: 11, ...FONTS.regular, color: COLORS.BRAND_GREY},
  itemHorizontal: {
    paddingVertical: tiny,
    paddingHorizontal: normal,
    marginEnd: small,
    borderRadius: normal,
  },
});

type SelectItemsHorizontalType = {
  data: Array,
  selectedIndex: Function,
  onSelectItem: Object,
  title: string,
  style: ViewStyle,
};

const SelectItemsHorizontal = ({
  data,
  selectedIndex = 0,
  onSelectItem,
  title,
  style,
}: SelectItemsHorizontalType) => {
  return (
    <View style={style}>
      <Text style={styles.titleSelect}>{title}</Text>
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {data.map(item => {
            const isSelect = selectedIndex === item.id;
            const itemBackground = {
              backgroundColor: isSelect ? COLORS.PRIMARY_A100 : COLORS.SELECTED_AREA,
            };
            const textStyle = {color: isSelect ? COLORS.NEUTRAL_WHITE : COLORS.BLACK_33};
            return (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.8}
                onPress={() => onSelectItem(item)}
                style={[styles.itemHorizontal, itemBackground]}>
                <Text style={textStyle}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const SlotSelectionFilter = ({filterData, onConfirmed, projectTypeName, projectStatus}) => {
  const [state, setState] = useState(filterData);

  const updateState = (key, value) => {
    if (value || value === 0) {
      setState({...state, ...{[key]: value}});
    }
  };

  const resetState = () => setState(SlotSelectionUtil.getInitialFilterData());
  const showFilterPrice = projectStatus !== TRANSACTION_MODE.BOOKING;
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{translate(STRINGS.FILTER_DATA)}</Text>
      {showFilterPrice && (
        <RangeInputSelect
          titleStyle={{...FONTS.regular, color: COLORS.BRAND_GREY}}
          defaultValue={state?.priceRange}
          onValueChange={values => updateState(FilterComponentKey.priceRange, values)}
        />
      )}
      <RangeInputSelect
        titleStyle={{...FONTS.regular, color: COLORS.BRAND_GREY}}
        defaultValue={state?.acreageRange}
        onValueChange={values => updateState(FilterComponentKey.acreageRange, values)}
        maxLength={6}
        title={translate(STRINGS.ACREAGE)}
        arrayRange={AQUARE_ARRAY}
      />
      <DropdownWithTitle
        isRequired={false}
        headerStyles={styles.sectionText}
        title={translate(STRINGS.HOUSE_DIRECTION)}
        dropdownTitle={translate(STRINGS.HOUSE_DIRECTION)}
        popupTitle={translate(STRINGS.HOUSE_DIRECTION)}
        items={state.directionsData}
        showSearchBox={false}
        error={''}
        itemSelected={item => updateState(FilterComponentKey.direction, item.id)}
      />
      {/* Balcony direction dropdown  */}
      {projectTypeName === PropertyType.apartment && (
        <DropdownWithTitle
          isRequired={false}
          headerStyles={styles.sectionText}
          title={translate(STRINGS.BALCONY_DIRECTION)}
          dropdownTitle={translate(STRINGS.BALCONY_DIRECTION)}
          popupTitle={translate(STRINGS.BALCONY_DIRECTION)}
          items={state.balconyDirectionsData}
          showSearchBox={false}
          error={''}
          itemSelected={item => updateState(FilterComponentKey.balconyDirection, item.id)}
        />
      )}

      {projectTypeName !== PropertyType.land && (
        <>
          <SelectItemsHorizontal
            title={translate('project.slotSelection.filter.bathroom')}
            style={{marginVertical: normal}}
            data={state?.bathRoomData}
            selectedIndex={state?.numberOfBathRooms}
            onSelectItem={item => updateState(FilterComponentKey.numberOfBathRooms, item.id)}
          />
          <SelectItemsHorizontal
            title={translate('project.slotSelection.filter.bedroom')}
            data={state?.bedRoomData}
            selectedIndex={state?.numberOfBedRooms}
            onSelectItem={item => updateState(FilterComponentKey.numberOfBedRooms, item.id)}
          />
        </>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          style={commonStyles.buttonNextConfirm}
          title={translate(STRINGS.RESET_FILTER)}
          onPress={() => resetState()}
          titleColor={COLORS.PRIMARY_A100}
        />
        <CustomButton
          style={commonStyles.buttonConfirm}
          title={translate(STRINGS.CONFIRM)}
          onPress={() => onConfirmed(state)}
        />
      </View>
    </View>
  );
};

export default SlotSelectionFilter;
