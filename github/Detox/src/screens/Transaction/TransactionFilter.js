import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {TIME_OFFSET_IN_MINUTE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import BaseFilterScreen from '../../components/BaseFilterScreen';
import DatePickerSection from '../../components/Button/DatePickerSection';
import CustomCheckbox from '../../components/Checkbox/CustomCheckbox';
import {getDateBeforeByDate, stringToDate} from '../../utils/TimerCommon';
import TransactionUtil, {TRANSACTION_RANGE_DATE} from './TransactionUtil';

const styles = StyleSheet.create({
  sectionText: {
    ...FONTS.semiBold,
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
  },
});

const commonCheckBoxStyle = {
  style: HELPERS.fill,
  images: ['checkbox', 'checkbox-blank-outline'],
  customCheckedBox: true,
};

const TransactionFilter = ({filterData, onClose, onConfirmed}) => {
  const [state, setState] = useState(filterData);
  const onChangeFromDate = date => {
    if (!state.toDate || moment(date).isSameOrBefore(state.toDate, 'day')) {
      setState({...state, fromDate: date.toISOString()});
    }
  };

  const onChangeToDate = date => {
    if (!state.fromDate || moment(date).isSameOrAfter(state.fromDate, 'day')) {
      setState({...state, toDate: date.toISOString()});
    }
  };

  return (
    <BaseFilterScreen
      onClose={onClose}
      onConfirmed={() => onConfirmed(state)}
      onClearFilter={() => setState(TransactionUtil.getInitialFilterData())}>
      <Text style={styles.sectionText}>{translate(STRINGS.TRANSACTION_STATUS)}</Text>
      <View style={METRICS.verticalMargin}>
        <View style={HELPERS.row}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.pending}
            checkValue={isChecked => setState({...state, pending: isChecked})}
            title={translate('payment.status.waitingForPay')}
          />
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.alreadyBooked}
            checkValue={isChecked => setState({...state, alreadyBooked: isChecked})}
            title={translate(STRINGS.ALREADY_BOOKED)}
          />
        </View>
        <View style={[HELPERS.row, METRICS.smallVerticalMargin]}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.expired}
            checkValue={isChecked => setState({...state, expired: isChecked})}
            title={translate('payment.status.expired')}
          />
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.waitingDeposit}
            checkValue={isChecked => setState({...state, waitingDeposit: isChecked})}
            title={translate(STRINGS.WAITING_DEPOSIT)}
          />
        </View>
        <View style={HELPERS.row}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.deposited}
            checkValue={isChecked => setState({...state, deposited: isChecked})}
            title={translate(STRINGS.DEPOSITED)}
          />
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.noDeposit}
            checkValue={isChecked => setState({...state, noDeposit: isChecked})}
            title={translate(STRINGS.NO_DEPOSIT)}
          />
        </View>
        <View style={[HELPERS.row, METRICS.smallVerticalMargin]}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.refundRequest}
            checkValue={isChecked => setState({...state, refundRequest: isChecked})}
            title={translate(STRINGS.REFUND_REQUEST)}
          />
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.refunded}
            checkValue={isChecked => setState({...state, refunded: isChecked})}
            title={translate('payment.status.refunded')}
          />
        </View>
        <View style={HELPERS.row}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.signedContract}
            checkValue={isChecked => setState({...state, signedContract: isChecked})}
            title={translate('common.signedContract')}
          />
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.depositCancel}
            checkValue={isChecked => setState({...state, depositCancel: isChecked})}
            title={translate('common.cancelDeposit')}
          />
        </View>
        <View style={[HELPERS.row, METRICS.smallVerticalMargin]}>
          <CustomCheckbox
            {...commonCheckBoxStyle}
            parentCheckedValue={state.depositTransfer}
            checkValue={isChecked => setState({...state, depositTransfer: isChecked})}
            title={translate(STRINGS.DEPOSIT_TRANSFER)}
          />
        </View>
      </View>
      <Text style={styles.sectionText}>{translate(STRINGS.TRANSACTION_DATE)}</Text>
      <View style={[HELPERS.row]}>
        <View style={[HELPERS.fill, METRICS.normalMarginEnd]}>
          <DatePickerSection
            isShowLabel={false}
            isShowIcon={true}
            value={state.fromDate}
            onChosen={onChangeFromDate}
            maximumDate={stringToDate(state.toDate)}
            minimumDate={getDateBeforeByDate(state.toDate, TRANSACTION_RANGE_DATE)}
            placeholder={translate(STRINGS.DATE_HOLDER)}
            timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          />
        </View>
        <View style={[HELPERS.fill, METRICS.mediumMarginBottom]}>
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
    </BaseFilterScreen>
  );
};

export default TransactionFilter;
