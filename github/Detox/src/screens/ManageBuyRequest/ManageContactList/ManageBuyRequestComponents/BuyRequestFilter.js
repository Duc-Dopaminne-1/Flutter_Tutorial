import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {getUserEmail} from '../../../../appData/user/selectors';
import {BUY_REQUEST_TYPE, TIME_OFFSET_IN_MINUTE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import DatePickerSection from '../../../../components/Button/DatePickerSection';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import ArrayUtils from '../../../../utils/ArrayUtils';
import {SCREEN_SIZE} from '../../../../utils/ImageUtil';
import {getDateBeforeByDate, stringToDate} from '../../../../utils/TimerCommon';
import FooterButtons from '../../../ManagePost/NewPost/NewPostComponents/FooterButtons';
import {NewPostStyles} from '../../../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import BuyRequestUtil, {FILTER_STATUS_OPTIONS} from '../../BuyRequestUtil';

const styles = StyleSheet.create({
  sectionText: {
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
  borderGrey: {
    borderColor: COLORS.GRAY_C9,
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
  },
  containerTo: {
    flex: 1 / 7,
    justifyContent: 'center',
    ...METRICS.tinyMarginTop,
  },
  footerButton: {
    marginBottom: 0,
  },
  sectionCheckBox: {flexWrap: 'wrap', flexDirection: 'row'},
  itemStyle: {width: SCREEN_SIZE.WIDTH / 2 - 32, marginVertical: 4},
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

const BuyRequestFilter = ({filterData, onConfirmed, type = BUY_REQUEST_TYPE.SENT}) => {
  const [state, setState] = useState(filterData);
  const [listStatus, setListStatus] = useState(FILTER_STATUS_OPTIONS);

  useEffect(() => {
    setListStatus(mapListData(FILTER_STATUS_OPTIONS, filterData.tradingStatus));
  }, [filterData.tradingStatus]);

  const userEmail = useSelector(getUserEmail);
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

  const onCheckedMyself = isChecked => {
    const itemChange = {isRequester: isChecked};
    const userRequester = isChecked ? {customerEmail: userEmail} : {customerEmail: null};
    const newState = {...state, ...itemChange, ...userRequester};
    setState(newState);
  };

  const onClearFilter = () => {
    const keywords = filterData?.keywords;
    const initialFilterData = BuyRequestUtil.getInitialFilterData(type);
    setState({...initialFilterData, keywords});
    setListStatus(mapListData(FILTER_STATUS_OPTIONS));
  };

  const onChooseStatus = items => {
    const statusChoose = items?.map(e => e.id);
    setState({...state, tradingStatus: statusChoose});
  };
  const onRemoveStatus = ids => {
    setState({...state, tradingStatus: ids});
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.marginTop}
          inputStyle={{...commonStyles.inputBorder, ...styles.borderGrey}}
          headerStyles={commonStyles.blackText14}
          title={translate('contactTrading.processTradingStatus')}
          dropdownTitle={translate(STRINGS.ALL)}
          popupTitle={translate('contactTrading.processTradingStatus')}
          items={listStatus}
          onChosen={onChooseStatus}
          onRemoveItem={onRemoveStatus}
          isSelectSingle={false}
          isHavingAll={false}
          dropdownPlaceHolderStyle={commonStyles.blackText14}
        />
        <Text style={[METRICS.marginTop, commonStyles.blackText14]}>
          {type === BUY_REQUEST_TYPE.SENT
            ? translate('contactTrading.createdTime')
            : translate('contactTrading.updatedTime')}
        </Text>
        <View style={[HELPERS.row]}>
          <View style={[HELPERS.fill]}>
            <DatePickerSection
              isShowLabel={false}
              isShowIcon={true}
              value={state?.fromDate}
              onChosen={onChangeFromDate}
              maximumDate={stringToDate(state.toDate)}
              minimumDate={getDateBeforeByDate(state.toDate, BuyRequestUtil.LIMIT_RANGE_DATE)}
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
        <View style={commonStyles.separatorRow12} />
        {type === BUY_REQUEST_TYPE.SENT && (
          <View style={commonStyles.rowCheckBox}>
            <CustomCheckbox
              images={['checkbox', 'checkbox-blank-outline']}
              shouldGetValueOutSide
              parentCheckedValue={state?.isRequester}
              checkValue={isChecked => onCheckedMyself(isChecked)}
              title={translate(STRINGS.I_AM_REQUESTER_TO_BUY)}
              customCheckedBox
              iconCheckedColor={COLORS.PRIMARY_A100}
              iconColor={COLORS.GRAY_C9}
              textStyle={commonStyles.blackText14}
            />
          </View>
        )}
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

export default BuyRequestFilter;
