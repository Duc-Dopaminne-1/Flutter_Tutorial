import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  APP_CURRENCY,
  CommissionCurrencyUnit,
  CONTACT_TRADING_DEPOSIT_STATUS,
  KEY_BOARD_TYPE,
  TIME_OFFSET_IN_MINUTE,
} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS, small} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import DatePickerSection from '../../../../../components/Button/DatePickerSection';
import InputWithDropdown from '../../../../../components/Input/InputWithDropdown';
import InputSection from '../../../../../components/InputSection';
import RequiredLabel from '../../../../../components/RequiredLabel';
import TextView from '../../../../../components/TextView';
import NumberUtils from '../../../../../utils/NumberUtils';
import {getDatePickerPropsFromTimeStamp} from '../../../../../utils/TimerCommon';
import PropertyPostUtils from '../../../../ManagePost/PropertyPostUtils';
import {DEPOSIT_INPUTS, DEPOSIT_STATUS, DEPOSIT_STATUS_COLOR} from '../../../DetailRequestConstant';
import SelectBankDropdownView from './SelectBankDropdownView';
import SelectDepositMethodDropdown from './SelectDepositMethodDropdownView';

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
  inputCustomRightComponentContainer: {
    paddingStart: small,
    justifyContent: 'center',
  },
  txtInput: {
    ...commonStyles.txtFontSize14,
    color: COLORS.BLACK_33,
  },
  inputTitle: {
    ...commonStyles.blackTextBold14,
  },
  input: {
    height: '100%',
  },
  statusTitle: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.GRAY_A3,
  },
  statusValue: {
    alignSelf: 'flex-end',
    color: COLORS.BLACK_33,
    ...FONTS.fontSize14,
    ...FONTS.bold,
  },
  propertyInfoValue: {
    alignSelf: 'flex-end',
    color: COLORS.BLACK_33,
    ...FONTS.fontSize14,
    ...FONTS.regular,
  },
  section: {
    ...METRICS.horizontalPadding,
    ...METRICS.smallNormalVerticalPadding,
  },
});

const SYMBOL_COLON = ':';

const ProductInfoView = ({postId, currentPrice, commission, currencyUnit}) => {
  const formattedCommission = PropertyPostUtils.parseCommission(
    commission,
    currencyUnit,
    CommissionCurrencyUnit.PERCENTAGE,
  );
  const formattedCurrentPrice = NumberUtils.formatNumberToCurrencyNumber(currentPrice, 0);
  return (
    <View style={styles.section}>
      <Text style={styles.header}>{translate(STRINGS.PRODUCT_INFORMATION)}</Text>
      <View style={commonStyles.separatorRow16} />
      <TextView
        title={translate(STRINGS.PROPERTY_CODE_DESC) + SYMBOL_COLON}
        titleStyle={styles.statusTitle}
        customRightComponent={
          <View style={HELPERS.fill}>
            <Text style={styles.propertyInfoValue}>{postId}</Text>
          </View>
        }
      />
      <View style={commonStyles.separatorRow8} />
      <TextView
        title={translate(STRINGS.CURRENT_PRICE) + SYMBOL_COLON}
        titleStyle={styles.statusTitle}
        customRightComponent={
          <View style={HELPERS.fill}>
            <Text
              style={styles.propertyInfoValue}>{`${formattedCurrentPrice} ${APP_CURRENCY}`}</Text>
            {!!currentPrice && (
              <Text style={[commonStyles.blackText14, HELPERS.textRight]}>
                {`(${NumberUtils.mapNumberToWord(currentPrice)})`}
              </Text>
            )}
          </View>
        }
      />
      <View style={commonStyles.separatorRow8} />
      <TextView
        title={translate(STRINGS.COMMISSION) + SYMBOL_COLON}
        titleStyle={styles.statusTitle}
        customRightComponent={
          <View style={HELPERS.fill}>
            <Text style={styles.propertyInfoValue}>{formattedCommission}</Text>
          </View>
        }
      />
    </View>
  );
};

const SelectDepositDate = ({
  editable,
  signDateFrom,
  signDateTo,
  error,
  onPickDepositFromDate,
  onPickDepositToDate,
}) => {
  const {date: dateFrom, formattedDate: formattedDateFrom} =
    getDatePickerPropsFromTimeStamp(signDateFrom);
  const {date: dateTo, formattedDate: formattedDateTo} =
    getDatePickerPropsFromTimeStamp(signDateTo);

  return (
    <>
      <RequiredLabel
        titleStyle={styles.inputTitle}
        title={translate('contactTrading.deposit.depositPayDay')}
      />
      <View style={[HELPERS.rowCenter, HELPERS.fullWidth, METRICS.smallMarginTop]}>
        <DatePickerSection
          isShowLabel={false}
          customStyle={HELPERS.fill}
          customButtonStyle={[commonStyles.input, METRICS.resetMargin]}
          value={dateFrom}
          dateOnView={formattedDateFrom}
          isShowIcon
          placeholder="dd/mm/yyyy"
          timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          isRequired
          onChosen={onPickDepositFromDate}
          pickerMode={'date'}
          disabled={!editable}
          minimumDate={new Date()}
          maximumDate={signDateTo ? new Date(signDateTo) : null}
        />
        <View
          style={{
            ...HELPERS.selfStretch,
            ...HELPERS.center,
            ...METRICS.smallHorizontalMargin,
          }}>
          <Text style={commonStyles.blackText14}>{translate(STRINGS.TO)}</Text>
        </View>
        <DatePickerSection
          isShowLabel={false}
          customStyle={HELPERS.fill}
          customButtonStyle={[commonStyles.input, METRICS.resetMargin]}
          value={dateTo}
          dateOnView={formattedDateTo}
          isShowIcon
          placeholder="dd/mm/yyyy"
          timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
          isRequired
          onChosen={onPickDepositToDate}
          pickerMode={'date'}
          disabled={!editable || !signDateFrom}
          minimumDate={new Date(signDateFrom)}
          maximumDate={null}
        />
      </View>
      {!!error && (
        <Text style={{...commonStyles.blackText12, color: COLORS.STATE_ERROR}}>
          {translate(error)}
        </Text>
      )}
    </>
  );
};

const calculateCommissionFee = (commission, currencyUnit, closingPrice) => {
  if (currencyUnit === CommissionCurrencyUnit.PERCENTAGE) {
    return `${(closingPrice * NumberUtils.parseFloatValue(commission)) / 100}`;
  }
  return `${commission}`;
};

const calculatePlatformFee = (percentage, totalCommission) => {
  if (!percentage || !totalCommission) {
    return '0';
  }
  return `${(percentage * totalCommission) / 100}`;
};

const commissionTypes = [
  {
    checked: false,
    id: CommissionCurrencyUnit.PERCENTAGE,
    name: '%',
  },
  {
    checked: false,
    id: CommissionCurrencyUnit.VND,
    name: APP_CURRENCY,
  },
];

const CommissionInput = ({
  title,
  placeholder = '',
  error,
  value,
  dropdownValue = CommissionCurrencyUnit.PERCENTAGE,
  keyboardType = KEY_BOARD_TYPE.FLOAT_NUMBER,
  onChangeText,
  onSelectType,
  disabled,
}) => {
  const isPercentage = dropdownValue === CommissionCurrencyUnit.PERCENTAGE;
  const [commissionTypeList, setCommissionTypeList] = useState(commissionTypes);
  const [isFocused, setIsFocused] = useState(false);

  const updateDropdownValue = () => {
    setCommissionTypeList(commissionTypeList.map(e => ({...e, checked: e.id === dropdownValue})));
  };
  useEffect(updateDropdownValue, [dropdownValue]);

  const onChange = text => {
    if (isPercentage) {
      onChangeText(text);
    } else {
      const removeCommaText = NumberUtils.removeAllComma(text);
      onChangeText(removeCommaText);
    }
  };

  const onFocusInput = () => setIsFocused(true);

  const onBlurInput = () => setIsFocused(false);

  const highlightedStyle = {borderColor: COLORS.PRIMARY_A100};

  const formattedValue = isPercentage ? value : NumberUtils.formatNumberToCurrencyNumber(value, 0);

  return (
    <InputWithDropdown
      placeholder={placeholder}
      // style={styles.commission}
      inputStyle={{...commonStyles.inputBorderWithIcon, ...(isFocused && highlightedStyle)}}
      titleStyle={commonStyles.blackText14}
      selectBoxStyle={{...commonStyles.inputBorderWithIcon, ...(isFocused && highlightedStyle)}}
      value={`${formattedValue}`}
      keyboardType={keyboardType}
      returnKeyType="done"
      isDropdown={true}
      editable={!disabled}
      items={commissionTypeList}
      onSelect={onSelectType}
      title={title}
      error={error}
      onChangeText={onChange}
      onFocus={onFocusInput}
      onBlur={onBlurInput}
      hint={''}
    />
  );
};

const DepositInfoView = ({
  errors,
  focusedInput,
  editable,
  banksData,
  numberOfDepositTimes,
  closingPrice,
  onChangeFinalPrice,
  commission = '',
  tplCommission,
  onChangeCommission,
  commissionUnitId,
  onChangeCommissionType,
  depositedAmount,
  onChangeDepositedAmount,
  signDateFrom,
  signDateTo,
  onPickDepositFromDate,
  onPickDepositToDate,
  onChosenDepositMethod,
  chosenPaymentMethod,
  onChosenBank,
  depositTerm,
  chosenBankName,
  onChangeDepositValidDuration,
  onFocusInput,
  onBlurInput,
}) => {
  const isPercentage = commissionUnitId === CommissionCurrencyUnit.PERCENTAGE;
  const highlightStyle = {borderColor: COLORS.PRIMARY_A100};

  const totalCommissionFee = calculateCommissionFee(commission, commissionUnitId, closingPrice);

  const tplPlatformFee = calculatePlatformFee(tplCommission, totalCommissionFee);

  const isFocused = inputName => focusedInput === inputName;

  return (
    <View style={styles.section}>
      <Text style={styles.header}>{`${translate(
        STRINGS.DEPOSIT_INFOMATION,
      )} (lần ${numberOfDepositTimes})`}</Text>
      <View style={commonStyles.separatorRow8} />
      <InputSection
        headerTitle={translate('contactTrading.deposit.officialSellingPrice')}
        headerStyles={styles.inputTitle}
        placeholder={translate('contactTrading.deposit.officialSellingPrice')}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        inputContainerStyle={[
          commonStyles.input,
          isFocused(DEPOSIT_INPUTS.closingPrice) && highlightStyle,
        ]}
        value={`${closingPrice}`}
        error={errors.closingPrice}
        isRequired
        editable={editable}
        onChangeText={onChangeFinalPrice}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
        onFocus={() => onFocusInput(DEPOSIT_INPUTS.closingPrice)}
        onBlur={onBlurInput}
      />
      <CommissionInput
        title={translate('contactTrading.deposit.commission')}
        placeholder={translate('contactTrading.deposit.commission')}
        error={errors?.commission}
        value={commission}
        dropdownValue={commissionUnitId}
        keyboardType={isPercentage ? KEY_BOARD_TYPE.FLOAT_NUMBER : KEY_BOARD_TYPE.INT_NUMBER}
        onChangeText={onChangeCommission}
        onSelectType={onChangeCommissionType}
        disabled={!editable}
      />
      <InputSection
        headerTitle={translate('contactTrading.deposit.totalCommission')}
        headerStyles={styles.inputTitle}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        editable={false}
        inputContainerStyle={commonStyles.input}
        value={totalCommissionFee || '0'}
        onChangeText={onChangeDepositedAmount}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
      />
      <InputSection
        headerTitle={translate('contactTrading.deposit.topenlandPlatformFee')}
        headerStyles={styles.inputTitle}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        editable={false}
        inputContainerStyle={commonStyles.input}
        value={tplPlatformFee}
        onChangeText={onChangeDepositedAmount}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
      />
      <InputSection
        headerTitle={translate(STRINGS.DEPOSIT_AMOUNT)}
        headerStyles={styles.inputTitle}
        placeholder={translate(STRINGS.ENTER_DEPOSIT_AMOUNT)}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        isRequired
        editable={editable}
        inputContainerStyle={[
          commonStyles.input,
          isFocused(DEPOSIT_INPUTS.depositedAmount) && highlightStyle,
        ]}
        value={`${depositedAmount}`}
        error={errors.depositedAmount}
        onChangeText={onChangeDepositedAmount}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
        onFocus={() => onFocusInput(DEPOSIT_INPUTS.depositedAmount)}
        onBlur={onBlurInput}
      />
      <InputSection
        headerTitle={translate('contactTrading.deposit.remainingPayAmount')}
        headerStyles={styles.inputTitle}
        placeholder={translate(STRINGS.ENTER_DEPOSIT_AMOUNT)}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        editable={false}
        inputContainerStyle={commonStyles.input}
        value={`${closingPrice - depositedAmount}`}
        onChangeText={onChangeDepositedAmount}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
      />
      <View style={commonStyles.separatorRow8} />
      <SelectDepositDate
        editable={editable}
        signDateFrom={signDateFrom}
        signDateTo={signDateTo}
        onPickDepositFromDate={onPickDepositFromDate}
        onPickDepositToDate={onPickDepositToDate}
        error={errors.depositedDate}
      />
      <View style={commonStyles.separatorRow8} />
      <InputSection
        headerTitle={translate(STRINGS.DEPOSIT_VALID_DURATION)}
        headerStyles={styles.inputTitle}
        placeholder={translate(STRINGS.ENTER_DEPOSIT_VALID_DURATION)}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        inputContainerStyle={[
          commonStyles.input,
          isFocused(DEPOSIT_INPUTS.depositTerm) && highlightStyle,
        ]}
        inputStyle={styles.input}
        value={depositTerm}
        error={errors.depositTerm}
        editable={editable}
        onChangeText={onChangeDepositValidDuration}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text
              style={
                !editable ? {...styles.txtInput, color: COLORS.TEXT_DARK_40} : styles.txtInput
              }>
              {translate(STRINGS.DAY_CAP)}
            </Text>
          </View>
        }
        isInputIntPrice
        onFocus={() => onFocusInput(DEPOSIT_INPUTS.depositTerm)}
        onBlur={onBlurInput}
      />
      <SelectDepositMethodDropdown
        disabled={!editable}
        onChosen={onChosenDepositMethod}
        chosenMethodId={chosenPaymentMethod}
      />
      <View style={commonStyles.separatorRow8} />
      <SelectBankDropdownView
        banksData={banksData}
        onChosen={onChosenBank}
        chosenMethodId={chosenPaymentMethod}
        chosenBankName={chosenBankName}
        error={errors.bankName}
        disabled={!editable}
      />
    </View>
  );
};

const DepositStatusView = ({depositStatus = '', rejectReason = ''}) => {
  const statusColor = DEPOSIT_STATUS_COLOR[depositStatus] ?? '';
  const statusRejected = depositStatus === CONTACT_TRADING_DEPOSIT_STATUS.rejected;

  return (
    <View>
      <TextView
        title={translate(STRINGS.STATUS) + SYMBOL_COLON}
        titleStyle={styles.statusTitle}
        customRightComponent={
          <View style={HELPERS.fill}>
            <Text style={[styles.statusValue, {color: statusColor}]}>
              {DEPOSIT_STATUS[depositStatus] ?? ''}
            </Text>
          </View>
        }
      />
      {!!rejectReason && statusRejected && (
        <TextView
          containerStyle={METRICS.smallMarginTop}
          title={translate(STRINGS.REASON) + SYMBOL_COLON}
          titleStyle={styles.statusTitle}
          customRightComponent={
            <View style={HELPERS.fill}>
              <Text style={styles.propertyInfoValue}>{rejectReason}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const TradingDepositInput1View = ({
  editable,
  errors,
  postPrice,
  postCommission,
  propertyCode,
  postCommissionUnitId,
  numberOfDepositTimes,
  depositStatus,
  rejectReason,
  closingPrice,
  commission,
  commissionUnitId,
  commissionTpl,
  depositedAmount,
  depositPaymentTermFrom,
  depositPaymentTermTo,
  depositTerm,
  bankName,
  paymentMethodId,
  banksData,
  focusedInput,
  onFocusInput = () => {},
  onBlurInput = () => {},
  onChangeFinalPrice = () => {},
  onChangeCommission = () => {},
  onChangeCommissionType = () => {},
  onChangeDepositedAmount = () => {},
  onPickDepositFromDate = () => {},
  onPickDepositToDate = () => {},
  onChosenDepositMethod = () => {},
  onChosenBank = () => {},
  onChangeDepositValidDuration = () => {},
}) => {
  return (
    <View style={HELPERS.backgroundWhite}>
      <View style={commonStyles.separatorRow24} />
      {!!depositStatus && (
        <View style={styles.section}>
          <DepositStatusView depositStatus={depositStatus} rejectReason={rejectReason} />
          <View style={commonStyles.separatorRow8} />
        </View>
      )}
      <ProductInfoView
        postId={propertyCode}
        currentPrice={postPrice}
        commission={postCommission}
        currencyUnit={postCommissionUnitId}
      />
      <View style={commonStyles.separatorRow8WithColor} />
      <DepositInfoView
        errors={errors}
        editable={editable}
        banksData={banksData}
        commission={commission}
        tplCommission={commissionTpl}
        commissionUnitId={commissionUnitId}
        numberOfDepositTimes={numberOfDepositTimes}
        closingPrice={closingPrice}
        depositedAmount={depositedAmount}
        signDateFrom={depositPaymentTermFrom}
        signDateTo={depositPaymentTermTo}
        depositTerm={depositTerm?.toString() ?? ''}
        chosenBankName={bankName}
        chosenPaymentMethod={paymentMethodId}
        focusedInput={focusedInput}
        onFocusInput={onFocusInput}
        onBlurInput={onBlurInput}
        onPickDepositFromDate={onPickDepositFromDate}
        onPickDepositToDate={onPickDepositToDate}
        onChosenDepositMethod={onChosenDepositMethod}
        onChosenBank={onChosenBank}
        onChangeFinalPrice={onChangeFinalPrice}
        onChangeCommission={onChangeCommission}
        onChangeCommissionType={onChangeCommissionType}
        onChangeDepositedAmount={onChangeDepositedAmount}
        onChangeDepositValidDuration={onChangeDepositValidDuration}
      />
    </View>
  );
};

export default TradingDepositInput1View;
