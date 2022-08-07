import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConfirmDialog} from 'react-native-simple-dialogs';

import {SEARCH_TYPE_INDEX} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CheckboxList from '../../../components/Checkbox/CheckboxList';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import HorizontalList from '../../../components/HorizontalList';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import Place from '../../../components/Place';
import {RangeInputSelect} from '../../../components/RangeInputSelect';
import RequiredLabel from '../../../components/RequiredLabel';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import ScreenIds from '../../ScreenIds';
import {aquareArray, RENTAL_PRICE_RANGE_LIST} from '../SearchMap/models/FilterModels';
import FilterBottomButtons from './FilterBottomButtons';

const mapStateToListCountsData = (list, chosenItemId) => {
  if (!list) {
    return [];
  }
  return list.map((e, index) => {
    let checked = false;
    if ((chosenItemId && e.id === chosenItemId) || (!chosenItemId && index === 0)) {
      checked = true;
    }
    return {
      ...e,
      checked,
    };
  });
};

const getPriceSlider = (searchType, state, onPriceChanged, onProjectPriceChanged) => {
  const isC2C = searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL;
  const isSearchRental = searchType === SEARCH_TYPE_INDEX.RENTAL;
  const arrayRentalPriceRange = isSearchRental
    ? {arrayRange: RENTAL_PRICE_RANGE_LIST.map(e => ({...e}))}
    : {};
  return (
    <RangeInputSelect
      {...arrayRentalPriceRange}
      placeHolder={['Thấp nhất', 'Cao nhất']}
      defaultValue={state.rangePriceJson}
      onValueChange={value => (isC2C ? onPriceChanged(value) : onProjectPriceChanged(value))}
      title={translate(STRINGS.FROM_PRICE)}
    />
  );
};

const showDuplicateCityError = (duplicateCityError, setDuplicateCityError) => {
  return (
    <ConfirmDialog
      title={translate(STRINGS.DEFAULT_MODAL_TITLE)}
      message={duplicateCityError.msg}
      visible={duplicateCityError.isShow}
      onTouchOutside={() => setDuplicateCityError({...duplicateCityError, msg: '', isShow: false})}
      positiveButton={{
        title: translate(STRINGS.CLOSE),
        onPress: () => setDuplicateCityError({...duplicateCityError, msg: '', isShow: false}),
      }}
    />
  );
};

export type Props = {
  dispatch: any,
  duplicateCityError: any,
  getDirectionCheckedAll: any,
  isShowPlaces: any,
  onAcreageChanged: any,
  onChangeBathRoom: any,
  onChangeBedRoom: any,
  onChangePropertyPostStatus: any,
  onChosenBalconyDirection: any,
  onConfirm: any,
  onDuplicateCity: any,
  onPriceChanged: any,
  onProjectPriceChanged: any,
  onRemoveBalconyDirection: any,
  onRemoveDirection: any,
  onResetFiler: any,
  onSelectDirection: any,
  onSelectPropertyType: any,
  onChangeProjectStatus: any,
  searchType: any,
  setDuplicateCityError: any,
  state: any,
};

const Filter = ({
  dispatch,
  duplicateCityError,
  getDirectionCheckedAll,
  isShowPlaces,
  onAcreageChanged,
  onChangeBathRoom,
  onChangeBedRoom,
  onChangePropertyPostStatus,
  onChosenBalconyDirection,
  onConfirm,
  onDuplicateCity,
  onPriceChanged,
  onProjectPriceChanged,
  onRemoveBalconyDirection,
  onRemoveDirection,
  onResetFiler,
  onSelectDirection,
  onSelectPropertyType,
  onChangeProjectStatus,
  searchType,
  setDuplicateCityError,
  state,
}: Props) => {
  return (
    <View style={styles.viewInside} testID={ScreenIds.PostSuccess}>
      <View style={commonStyles.viewFirstRow}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
      </View>
      <KeyboardScrollView>
        <View style={styles.container}>
          <CheckboxList
            title={translate(STRINGS.PROPERTY_TYPE)}
            titleStyle={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}
            selectedItems={state.propertyTypeJson}
            items={state.itemsData.propertyTypes}
            onSelect={onSelectPropertyType}
            listStyle={styles.sectionCheckBox}
            itemStyle={{width: SCREEN_SIZE.WIDTH / 2 - 32}}
          />
          <RequiredLabel
            style={[METRICS.smallPaddingTop]}
            title={translate(STRINGS.PLACE)}
            titleStyle={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}
            isRequired={false}
          />
          {isShowPlaces && (
            <Place
              place={state.placeJson?.[0]}
              dispatch={dispatch}
              cities={state.itemsData.cities}
              onDuplicateCity={onDuplicateCity}
            />
          )}

          {searchType === SEARCH_TYPE_INDEX.B2C && (
            <DropdownWithTitle
              headerStyles={[METRICS.smallPaddingTop, styles.titleStyle]}
              title={translate(STRINGS.STATUS)}
              dropdownTitle={translate(STRINGS.STATUS)}
              popupTitle={translate(STRINGS.STATUS)}
              items={state.itemsData.statuses}
              onChosen={onChangeProjectStatus}
              isHaveAll={true}
              isRequiredAtLeastOne={false}
              dropdownPlaceHolderStyle={commonStyles.blackText14}
            />
          )}

          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <DropdownWithTitle
              headerStyles={[METRICS.smallPaddingTop, styles.titleStyle]}
              title={translate(STRINGS.HOUSE_DIRECTION)}
              dropdownTitle={translate(STRINGS.ALL)}
              popupTitle={translate(STRINGS.HOUSE_DIRECTION)}
              items={state.itemsData.directions}
              value={
                getDirectionCheckedAll(state.itemsData.directions) ? translate(STRINGS.ALL) : null
              }
              onChosen={onSelectDirection}
              onRemoveItem={onRemoveDirection}
              isSelectSingle={false}
              isHaveAll={true}
              isRequiredAtLeastOne={false}
              dropdownPlaceHolderStyle={commonStyles.blackText14}
            />
          )}

          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <DropdownWithTitle
              headerStyles={[METRICS.smallPaddingTop, styles.titleStyle]}
              title={translate(STRINGS.BALCONY_DIRECTION)}
              dropdownTitle={translate(STRINGS.ALL)}
              popupTitle={translate(STRINGS.BALCONY_DIRECTION)}
              items={state.itemsData.balconyDirections}
              value={
                getDirectionCheckedAll(state.itemsData.balconyDirections)
                  ? translate(STRINGS.ALL)
                  : null
              }
              onChosen={onChosenBalconyDirection}
              onRemoveItem={onRemoveBalconyDirection}
              isSelectSingle={false}
              isHaveAll={true}
              isRequiredAtLeastOne={false}
              dropdownPlaceHolderStyle={commonStyles.blackText14}
            />
          )}

          {getPriceSlider(searchType, state, onPriceChanged, onProjectPriceChanged)}

          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <>
              <RangeInputSelect
                arrayRange={aquareArray}
                maxLength={3}
                defaultValue={state.rangeSquareJson}
                onValueChange={value => onAcreageChanged(value)}
                title={translate(STRINGS.ACREAGE)}
              />
              <View style={commonStyles.separatorRow12} />
            </>
          )}
          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <>
              <HorizontalList
                titleStyle={styles.titleStyle}
                title={translate('common.state')}
                items={mapStateToListCountsData(
                  state.itemsData.propertyPostStatus,
                  state.propertyPostStatus,
                )}
                onSelectedItem={onChangePropertyPostStatus}
              />
              <View style={commonStyles.separatorRow24} />
            </>
          )}
          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <>
              <HorizontalList
                titleStyle={styles.titleStyle}
                title={translate(STRINGS.NUMBER_OF_BEDROOM)}
                items={mapStateToListCountsData(
                  state.itemsData.numberOfRooms,
                  state.numberOfBedRoom,
                )}
                onSelectedItem={onChangeBedRoom}
              />
              <View style={commonStyles.separatorRow24} />
            </>
          )}
          {(searchType === SEARCH_TYPE_INDEX.C2C || searchType === SEARCH_TYPE_INDEX.RENTAL) && (
            <HorizontalList
              titleStyle={styles.titleStyle}
              title={translate(STRINGS.NUMBER_OF_BATHROOM)}
              items={mapStateToListCountsData(
                state.itemsData.numberOfBathRooms,
                state.numberOfBathRoom,
              )}
              onSelectedItem={onChangeBathRoom}
            />
          )}
          <View style={commonStyles.separatorRow24} />
        </View>
      </KeyboardScrollView>
      {showDuplicateCityError(duplicateCityError, setDuplicateCityError)}
      <FilterBottomButtons onPressCancelFilter={onResetFiler} onPressSearch={onConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewInside: {
    paddingTop: 10,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  titleText: {
    ...FONTS.semiBold,
    fontSize: 24,
  },
  container: {
    flexGrow: 1,
    marginHorizontal: normal,
  },
  titleStyle: {...FONTS.bold, color: COLORS.TEXT_DARK_10},
  sectionCheckBox: {flexWrap: 'wrap', flexDirection: 'row'},
});

export default Filter;
