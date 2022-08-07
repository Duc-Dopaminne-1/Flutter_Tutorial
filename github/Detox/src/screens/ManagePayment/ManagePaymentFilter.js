import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {TIME_OFFSET_IN_MINUTE} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseFilterScreen from '../../components/BaseFilterScreen';
import DatePickerSection from '../../components/Button/DatePickerSection';
import DropdownWithTitle from '../../components/DropdownWithTitle';
import {dropdownMapper} from '../../utils/DataProcessUtil';
import {getDateBeforeByDate, stringToDate} from '../../utils/TimerCommon';
import ManagePaymentFilterUtil, {
  LIMIT_RANGE_DATE,
  paymentStatus,
  paymentUnits,
  transactionServices,
} from './ManagePaymentFilterUtil';

const styles = StyleSheet.create({
  sectionText: {
    ...METRICS.marginTop,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
  },
  titleText: {
    ...METRICS.mediumPlusMarginTop,
    fontSize: 21,
    flex: 1,
    marginEnd: medium,
  },
  contextStyle: {
    borderRadius: SIZES.BORDER_RADIUS_10,
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
});

export const commonCheckBoxStyle = {
  style: HELPERS.fill,
  textStyle: {
    ...FONTS.fontSize14,
  },
};

const ManagePaymentFilter = ({filterData, onClose, onConfirmed}) => {
  const [state, setState] = useState({
    ...filterData,
    transactionServices: dropdownMapper(
      transactionServices,
      'id',
      'name',
      filterData?.transactionServiceType ?? '',
    ),
    paymentUnits: dropdownMapper(paymentUnits, 'id', 'name', filterData?.paymentUnit ?? ''),
    paymentStatus: dropdownMapper(
      paymentStatus,
      'id',
      'name',
      filterData?.transactionPaymentStatus ?? '',
    ),
  });
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

  const onChosenTransactionType = item => {
    setState({...state, transactionServiceType: item?.id});
  };

  const onChosenPaymentUnit = item => {
    setState({...state, paymentUnit: item?.id});
  };

  const onChosenPaymentStatus = item => {
    setState({...state, transactionPaymentStatus: item?.id});
  };

  const onClearFilter = () => {
    const resetFilterData = ManagePaymentFilterUtil.getInitialFilterData();
    setState({
      ...resetFilterData,
      transactionServices: dropdownMapper(transactionServices, 'id', 'name', ''),
      paymentUnits: dropdownMapper(paymentUnits, 'id', 'name', ''),
      paymentStatus: dropdownMapper(paymentStatus, 'id', 'name', ''),
    });
  };

  return (
    <BaseFilterScreen
      contextStyle={styles.contextStyle}
      closeStyle={styles.textClearFilter}
      isLeftButtonVisible={false}
      closeVisible={false}
      onClose={onClose}
      titleStyle={styles.titleText}
      onConfirmed={() => onConfirmed({...state})}
      rightButtonText={translate(STRINGS.APPLY)}
      bottomButtonsStyle={styles.footerButton}
      onClearFilter={onClearFilter}>
      <Text style={styles.sectionText}>{translate('payment.paymentDate')}</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <DatePickerSection
            isShowLabel={false}
            isShowIcon={true}
            value={state.fromDate}
            onChosen={onChangeFromDate}
            maximumDate={stringToDate(state.toDate)}
            minimumDate={getDateBeforeByDate(state.toDate, LIMIT_RANGE_DATE)}
            placeholder={translate(STRINGS.DATE_HOLDER)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          />
        </View>
        <View style={styles.containerTo}>
          <Text style={styles.textToStyle}>{translate(STRINGS.TO)}</Text>
        </View>
        <View style={styles.timeItem}>
          <DatePickerSection
            isShowLabel={false}
            isShowIcon={true}
            value={state.toDate}
            minimumDate={stringToDate(state.fromDate)}
            onChosen={onChangeToDate}
            placeholder={translate(STRINGS.DATE_HOLDER)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          />
        </View>
      </View>
      <DropdownWithTitle
        style={METRICS.marginTop}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate('payment.paymentService')}
        dropdownTitle={translate('payment.paymentServicePlaceHolder')}
        popupTitle={translate('payment.paymentService')}
        items={state.transactionServices}
        onChosen={onChosenTransactionType}
        showSearchBox={false}
      />
      <DropdownWithTitle
        style={METRICS.marginTop}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate(STRINGS.STATUS)}
        dropdownTitle={translate('payment.paymentStatusPlaceHolder')}
        popupTitle={translate(STRINGS.STATUS)}
        items={state?.paymentStatus}
        onChosen={onChosenPaymentStatus}
        showSearchBox={false}
      />
      <DropdownWithTitle
        style={METRICS.verticalMargin}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate('common.paymentMethod')}
        dropdownTitle={translate('payment.paymentTypePlaceHolder')}
        popupTitle={translate('common.paymentMethod')}
        items={state?.paymentUnits}
        onChosen={onChosenPaymentUnit}
        showSearchBox={false}
      />
    </BaseFilterScreen>
  );
};

export default ManagePaymentFilter;
