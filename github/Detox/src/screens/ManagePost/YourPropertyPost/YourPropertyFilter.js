import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {TIME_OFFSET_IN_MINUTE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DatePickerSection from '../../../components/Button/DatePickerSection';
import DropdownCities from '../../../components/DropdownCities';
import DropdownDistricts from '../../../components/DropdownDistricts';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import ArrayUtils from '../../../utils/ArrayUtils';
import {getDateBeforeByDate, stringToDate} from '../../../utils/TimerCommon';
import FooterButtons from '../NewPost/NewPostComponents/FooterButtons';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import {
  CONTRACT_STATUS,
  PROPERTY_RENT_STATUS_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
} from './FilterModel';
import YourPropertyFilterUtil from './YourPropertyFilterUtil';

const styles = StyleSheet.create({
  sectionText: {
    ...METRICS.marginTop,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
  },
  titleText: {
    ...FONTS.bold,
    fontSize: 24,
    flex: 1,
  },
  container: {
    borderRadius: 16,
    ...METRICS.padding,
  },
  textClearFilter: {
    ...METRICS.mediumPlusMarginTop,
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
    textDecorationLine: 'none',
  },
  textToStyle: {
    ...FONTS.fontSize14,
    textAlign: 'center',
    color: COLORS.BLACK_33_OPACITY,
  },
  containerTo: {
    flex: 1 / 7,
    justifyContent: 'center',
    ...METRICS.tinyMarginTop,
  },
  footerButton: {
    marginBottom: 0,
  },
  timeContainer: {
    ...HELPERS.row,
    width: '100%',
  },
  timeItem: {
    flex: 3 / 7,
  },
  dashView: {
    flex: 1 / 7,
    justifyContent: 'center',
    alignItems: 'center',
    ...METRICS.tinyMarginTop,
  },
  borderGrey: {
    borderColor: COLORS.GRAY_C9,
  },
});

export const commonCheckBoxStyle = {
  style: HELPERS.fill,
  textStyle: {
    ...FONTS.fontSize14,
  },
};

const mapListData = (listData, selectedItems: Array) => {
  if (ArrayUtils.hasArrayData(selectedItems)) {
    return listData?.map(e => ({...e, checked: selectedItems?.includes(e?.id)}));
  } else {
    return listData?.map(e => ({...e, checked: false}));
  }
};

const YourPropertyFilter = ({data, filterData, onConfirmed}) => {
  const {
    propertyTypes: propertyTypeList,
    forRent,
    guaranteedPackages: guaranteedPackageList,
  } = data;
  const statusData = forRent ? PROPERTY_RENT_STATUS_OPTIONS : PROPERTY_STATUS_OPTIONS;
  const [state, setState] = useState(filterData);
  const [listStatus, setListStatus] = useState(statusData);
  const [typeList, setTypeList] = useState(propertyTypeList);
  const [packageList, setPackageList] = useState(guaranteedPackageList);
  const [contractList, setContractList] = useState(CONTRACT_STATUS);
  const [isResetCity, setResetCity] = useState(true);

  useEffect(() => {
    if (isResetCity) {
      setResetCity(false);
    }
  }, [isResetCity]);

  useEffect(() => {
    setTypeList(mapListData(propertyTypeList, filterData.propertyTypes));
  }, [filterData.propertyTypes, propertyTypeList]);

  useEffect(() => {
    setListStatus(mapListData(statusData, filterData.propertyStatus));
  }, [filterData.propertyStatus, statusData]);

  useEffect(() => {
    setPackageList(mapListData(guaranteedPackageList, filterData.guaranteedPackages));
  }, [filterData.guaranteedPackages, guaranteedPackageList]);

  useEffect(() => {
    setContractList(mapListData(CONTRACT_STATUS, filterData.contractStatus));
  }, [filterData.contractStatus]);

  const onChangeFromDate = date => {
    if (moment(date).isSameOrBefore(state.toDate, 'day')) {
      setState({...state, fromDate: date.toISOString()});
    }
  };

  const onChangeToDate = date => {
    if (moment(date).isSameOrAfter(state.fromDate, 'day')) {
      setState({...state, toDate: date.toISOString()});
    }
  };

  const onChooseStatus = items => {
    const statusChoose = items?.map(e => e.id);
    setState({...state, propertyStatus: statusChoose});
  };
  const onRemoveStatus = ids => {
    setState({...state, propertyStatus: ids});
  };
  const onChoosePropertyType = items => {
    setState({...state, propertyTypes: items?.map(e => e.id)});
  };
  const onRemovePropertyTypes = ids => {
    setState({...state, propertyTypes: ids});
  };
  const onChangeCity = item => {
    if (item.id !== state?.cityId) {
      setState({...state, cityId: item.id});
    }
  };
  const onChangeDistrict = items => {
    setState({...state, districtIds: items?.map(e => ({id: e.id}))});
  };
  const onChoosePackage = items => {
    setState({...state, guaranteedPackages: items?.map(e => e.id)});
  };
  const onRemovePackage = ids => {
    setState({...state, guaranteedPackages: ids});
  };
  const onChooseContractStatus = items => {
    setState({...state, contractStatus: items?.map(e => e.id)});
  };
  const onRemoveContractStatus = ids => {
    setState({...state, contractStatus: ids});
  };

  const onClearFilter = () => {
    const clearData = YourPropertyFilterUtil.getInitialFilterData();
    setState(clearData);
    setResetCity(true);
    setListStatus(mapListData(forRent ? PROPERTY_RENT_STATUS_OPTIONS : PROPERTY_STATUS_OPTIONS));
    setTypeList(mapListData(propertyTypeList));
    setPackageList(mapListData(guaranteedPackageList));
    setContractList(mapListData(CONTRACT_STATUS));
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.mediumMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate('yourPropertyPost.propertyPostStatus')}
          dropdownTitle={translate('yourPropertyPost.propertyStatusPlaceHolder')}
          popupTitle={translate('yourPropertyPost.propertyPostStatus')}
          items={listStatus}
          onChosen={onChooseStatus}
          onRemoveItem={onRemoveStatus}
          isSelectSingle={false}
          isHavingAll={false}
        />
        <Text style={[METRICS.marginTop, commonStyles.blackText14]}>
          {translate('propertyPost.createDateTime')}
        </Text>
        <View style={[HELPERS.row]}>
          <View style={[HELPERS.fill]}>
            <DatePickerSection
              isShowLabel={false}
              isShowIcon={true}
              value={state?.fromDate}
              onChosen={onChangeFromDate}
              maximumDate={stringToDate(state.toDate)}
              minimumDate={getDateBeforeByDate(
                state.toDate,
                YourPropertyFilterUtil.LIMIT_RANGE_DATE,
              )}
              placeholder={translate(STRINGS.DATE_HOLDER)}
              timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
              customButtonStyle={styles.borderGrey}
            />
          </View>
          <View style={styles.dashView}>
            <Text style={[commonStyles.blackText14, FONTS.fontSize16]}>-</Text>
          </View>
          <View style={[HELPERS.fill]}>
            <DatePickerSection
              isShowLabel={false}
              isShowIcon={true}
              value={state?.toDate}
              minimumDate={stringToDate(state.fromDate)}
              onChosen={onChangeToDate}
              placeholder={translate(STRINGS.DATE_HOLDER)}
              timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
              customButtonStyle={styles.borderGrey}
            />
          </View>
        </View>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate(STRINGS.PROPERTY_TYPE)}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate(STRINGS.PROPERTY_TYPE)}
          items={typeList}
          onChosen={onChoosePropertyType}
          onRemoveItem={onRemovePropertyTypes}
          isSelectSingle={false}
          isHaveAll={false}
          dropdownPlaceHolderStyle={commonStyles.blackText14}
        />
        <View>
          <DropdownCities
            isReset={isResetCity}
            colorTheme={COLORS.PRIMARY_A100}
            style={METRICS.smallNormalMarginTop}
            title={translate(STRINGS.AREA)}
            titleStyle={commonStyles.blackText14}
            selectedId={state?.cityId}
            onChangeCity={onChangeCity}
            placeholder={translate(STRINGS.PROVINCE)}
            setDefaultFirst={false}
            inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          />
          <DropdownDistricts
            style={METRICS.tinyMarginTop}
            colorTheme={COLORS.PRIMARY_A100}
            selectedIds={state?.districtIds}
            onChangeDistrict={onChangeDistrict}
            cityId={state?.cityId}
            isSelectSingle={false}
            placeholder={translate(STRINGS.DISTRICT)}
            setDefaultFirst={false}
            inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          />
        </View>
        {
          // ***** Temporary hidden, ref: https://dev.azure.com/topenlandtech/ht-topenland/_workitems/edit/14688 *****
          /* <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate('propertyPost.guaranteedPackage')}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate('propertyPost.guaranteedPackage')}
          items={packageList}
          onChosen={onChoosePackage}
          onRemoveItem={onRemovePackage}
          isSelectSingle={false}
          isHaveAll={false}
          dropdownPlaceHolderStyle={commonStyles.blackText14}
        />
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallNormalMarginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate('propertyPost.contractStatusTitle')}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate('propertyPost.contractStatusTitle')}
          items={contractList}
          onChosen={onChooseContractStatus}
          onRemoveItem={onRemoveContractStatus}
          isSelectSingle={false}
          isHaveAll={false}
          dropdownPlaceHolderStyle={commonStyles.blackText14}
        /> */
        }
      </View>
      <View
        style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth, METRICS.marginBottom]}>
        <FooterButtons
          nextButtonTitle={translate(STRINGS.APPLY)}
          onPressNext={() => onConfirmed(state)}
          onPressCancel={onClearFilter}
          cancelButtonTitle={translate('common.reselect')}
          cancelTextStyle={commonStyles.blackTextBold14}
          cancelButtonStyle={NewPostStyles.backGrayNonBorder}
        />
      </View>
    </>
  );
};

export default YourPropertyFilter;
