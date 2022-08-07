import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  APP_CURRENCY,
  CONSTANTS,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
  TIME_OFFSET_IN_MINUTE,
} from '../../../../../assets/constants/index';
import {SIZES} from '../../../../../assets/constants/sizes';
import {IMAGES} from '../../../../../assets/images';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import DatePickerSection from '../../../../../components/Button/DatePickerSection';
import InputSection from '../../../../../components/InputSection';
import TextView from '../../../../../components/TextView';
import NumberUtils from '../../../../../utils/NumberUtils';
import {dateToTimestamp, getDatePickerPropsFromTimeStamp} from '../../../../../utils/TimerCommon';
import {DEPOSIT_INPUTS2} from '../../../DetailRequestConstant';
import ImagePicker from './UploadImagesComponent';

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
    ...METRICS.marginBottom,
  },
  uploadFileBtn: {
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  uploadFileRuleDescription: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  input: {
    height: '100%',
  },
  newProgressButton: {
    ...HELPERS.fullWidth,
    ...HELPERS.center,
    ...METRICS.smallNormalVerticalPadding,
    ...commonStyles.borderMain,
    ...commonStyles.borderDashed,
  },
  downloadContractButton: {
    ...HELPERS.fullWidth,
    ...HELPERS.rowCenter,
    ...METRICS.smallNormalVerticalPadding,
    ...commonStyles.borderMain,
    ...commonStyles.borderDashed,
  },
  iconDownload: {
    height: 24,
    width: 24,
  },
  buttonDisabled: {opacity: 0.4},
  section: {
    ...METRICS.smallNormalVerticalPadding,
    ...METRICS.horizontalPadding,
  },
  errorTextButtonAdd: {
    ...commonStyles.blackText12,
    ...HELPERS.selfCenter,
    color: COLORS.STATE_ERROR,
  },
});

const PaymentProgressInfoInputView = ({
  count = '',
  disabled,
  paymentTerms = '',
  remainingPayAmount = 0,
  errorPayDate,
  errorPayAmount,
  paymentDatetime,
  amount,
  onChangePaymentDatetime,
  onChangeAmount,
  onChangePaymentTerms,
  onPressErase,
  maximumDate,
  minimumDate = new Date(),
  focusedInput,
  onFocusInput,
  onBlurInput,
}: {
  count: String,
  disabled: Boolean,
  paymentTerms: String,
  remainingPayAmount: Number,
  paymentDatetime: Number,
  amount: Number,
  errorPayDate: String,
  errorPayAmount: String,
  onChangePaymentDatetime: (timeStamp: Number) => {},
  onChangeAmount: (formattedAmount: String) => {},
  onChangePaymentTerms: (terms: String) => {},
  onPressErase: () => {},
}) => {
  const {date, formattedDate} = getDatePickerPropsFromTimeStamp(paymentDatetime);

  const onPickDate = pickedDate => {
    const timestamp = dateToTimestamp(pickedDate);
    onChangePaymentDatetime && onChangePaymentDatetime(timestamp);
  };

  const onChangePayAmount = text => {
    onChangeAmount && onChangeAmount(text);
  };

  const onChangeCondition = text => {
    onChangePaymentTerms && onChangePaymentTerms(text);
  };

  const isFocused = inputName => focusedInput === inputName;

  const highlightStyle = {borderColor: COLORS.PRIMARY_A100};

  return (
    <View style={METRICS.smallVerticalMargin}>
      <TextView
        title={`${translate('contactTrading.deposit.paymentCount')} ${count}`}
        titleStyle={commonStyles.blackTextBold14}
        customRightComponent={
          count > 1 ? (
            <View style={[HELPERS.fill, HELPERS.crossEnd]}>
              <TouchableOpacity hitSlop={CONSTANTS.HIT_SLOP} onPress={onPressErase}>
                <Text style={{...commonStyles.blackText14, color: COLORS.PRIMARY_A100}}>
                  {translate('common.erase')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      <View style={commonStyles.separatorRow16} />
      <DatePickerSection
        headerTitle={translate('contactTrading.deposit.paymentDay')}
        headerStyle={commonStyles.blackTextBold14}
        customButtonStyle={commonStyles.input}
        value={date}
        dateOnView={formattedDate}
        isShowIcon
        placeholder="dd/mm/yyyy"
        timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
        isRequired
        onChosen={onPickDate}
        pickerMode={'date'}
        disabled={disabled}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        error={disabled ? '' : errorPayDate}
      />
      <View style={commonStyles.separatorRow16} />
      <InputSection
        headerTitle={translate('contactTrading.deposit.payAmount')}
        headerStyles={commonStyles.blackTextBold14}
        placeholder={translate('contactTrading.deposit.payAmount')}
        keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
        isRequired
        inputContainerStyle={[
          commonStyles.input,
          isFocused(`${DEPOSIT_INPUTS2.payAmount}${count}`) && highlightStyle,
        ]}
        value={`${amount}`}
        error={disabled ? '' : errorPayAmount}
        onChangeText={onChangePayAmount}
        inputStyle={styles.input}
        customRightComponent={
          <View style={styles.inputCustomRightComponentContainer}>
            <Text style={styles.txtInput}>{APP_CURRENCY}</Text>
          </View>
        }
        isInputIntPrice
        formatValue={e => NumberUtils.formatNumberToCurrencyNumber(e, 0)}
        editable={!disabled}
        onFocus={() => onFocusInput(`${DEPOSIT_INPUTS2.payAmount}${count}`)}
        onBlur={onBlurInput}
      />
      <InputSection
        headerTitle={translate('contactTrading.deposit.remainingPayAmount')}
        headerStyles={commonStyles.blackTextBold14}
        placeholder={translate(STRINGS.ENTER_DEPOSIT_AMOUNT)}
        inputContainerStyle={commonStyles.input}
        value={`${remainingPayAmount}`}
        editable={false}
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
        headerTitle={translate('contactTrading.deposit.paymentCondition')}
        headerStyles={commonStyles.blackTextBold14}
        placeholder={translate('contactTrading.deposit.paymentConditionPlaceholder')}
        inputStyle={[
          commonStyles.multilineInput,
          isFocused(`${DEPOSIT_INPUTS2.paymentNote}${count}`) && highlightStyle,
        ]}
        value={paymentTerms}
        editable={!disabled}
        onChangeText={onChangeCondition}
        multiline
        showMultilineInputView
        showLimitedLength
        maxLength={MAX_LENGTH.NOTE}
        onFocus={() => onFocusInput(`${DEPOSIT_INPUTS2.paymentNote}${count}`)}
        onBlur={onBlurInput}
      />
    </View>
  );
};

const PaymentProgressSection = ({
  showAddButton,
  disableAddButton,
  errorButtonAdd,
  progress = [],
  editable,
  errors,
  onChangeItemPaymentDatetime,
  onChangeItemDepositAmount,
  onChangeItemPaymentTerms,
  onPressNewProgress,
  onPressEraseProgress,
  focusedInput,
  onFocusInput,
  onBlurInput,
}: {
  showAddButton: Boolean,
  progress: Array<ProgressDetail>,
  editable: Boolean,
  errors: Array<ProgressDetail>,
  onChangeItemPaymentDatetime: (timeStamp: Number, itemIndex: Number) => {},
  onChangeItemDepositAmount: (formattedAmount: String, itemIndex: Number) => {},
  onChangeItemPaymentTerms: (terms: String, itemIndex: Number) => {},
  onPressNewProgress: () => {},
  onPressEraseProgress: (index: Number) => {},
}) => {
  const numberOfProgresses = progress?.length;
  const NewButton = (
    <>
      {numberOfProgresses <= 0 && (
        <View style={HELPERS.center}>
          <Text style={commonStyles.blackTextBold14}>
            {translate('contactTrading.deposit.emptyProgress')}
          </Text>
          <View style={commonStyles.separatorRow16} />
        </View>
      )}
      <TouchableOpacity
        style={[styles.newProgressButton, (!editable || disableAddButton) && styles.buttonDisabled]}
        onPress={onPressNewProgress}
        disabled={!editable || disableAddButton}>
        {numberOfProgresses > 0 ? (
          <View style={HELPERS.rowCenter}>
            <Icon name="add-box" size={20} color={COLORS.PRIMARY_A100} />
            <View style={commonStyles.separatorColumn8} />
            <Text style={{...commonStyles.blackTextBold14, color: COLORS.PRIMARY_A100}}>
              {translate('contactTrading.deposit.addNewPaymentProgress')}
            </Text>
          </View>
        ) : (
          <Text style={{...commonStyles.blackText14, color: COLORS.PRIMARY_A100}}>
            {translate('contactTrading.deposit.createPaymentProgress')}
          </Text>
        )}
      </TouchableOpacity>
      {!!errorButtonAdd && <Text style={styles.errorTextButtonAdd}>{errorButtonAdd}</Text>}
    </>
  );

  const ProgressesView = progress?.map((e: ProgressDetail, index) => {
    const {
      paymentTerms,
      remainingPayAmount: remainingAmount,
      paymentDatetime,
      amount,
      maxDate,
      minDate,
    } = e;
    return (
      <PaymentProgressInfoInputView
        key={index}
        count={index + 1}
        disabled={!editable}
        paymentTerms={paymentTerms}
        remainingPayAmount={remainingAmount}
        errorPayDate={errors?.length > 0 ? errors[index]?.paymentDatetime : ''}
        errorPayAmount={errors?.length > 0 ? errors[index]?.amount : ''}
        paymentDatetime={paymentDatetime}
        amount={amount}
        onChangePaymentDatetime={timeStamp => onChangeItemPaymentDatetime(timeStamp, index)}
        onChangeAmount={formattedAmount => onChangeItemDepositAmount(formattedAmount, index)}
        onChangePaymentTerms={terms => onChangeItemPaymentTerms(terms, index)}
        onPressErase={() => onPressEraseProgress(index)}
        minimumDate={minDate}
        maximumDate={maxDate ?? null}
        focusedInput={focusedInput}
        onFocusInput={onFocusInput}
        onBlurInput={onBlurInput}
      />
    );
  });

  return (
    <View style={styles.section}>
      <Text style={styles.header}>{translate('contactTrading.deposit.paymentProgress')}</Text>
      {ProgressesView}
      {showAddButton && NewButton}
    </View>
  );
};

const NotarizeTimeSection = ({
  notarizationDatetime,
  notaryOffice,
  onChangeNotaryOffice,
  onPickNotarizeDate,
  editable,
  errorNotarizeDatetime,
  errorNotaryOffice,
  focusedInput,
  onFocusInput,
  onBlurInput,
}) => {
  const {date: notarizationDate, formattedDate: notarizationFormattedDate} =
    getDatePickerPropsFromTimeStamp(notarizationDatetime);

  const highlightStyle = {borderColor: COLORS.PRIMARY_A100};

  const isFocused = inputName => focusedInput === inputName;

  return (
    <View style={styles.section}>
      <Text style={styles.header}>{translate('contactTrading.deposit.notarizeTime')}</Text>
      <View style={commonStyles.separatorRow16} />
      <DatePickerSection
        headerTitle={translate('contactTrading.deposit.notarizeDate')}
        headerStyle={commonStyles.blackTextBold14}
        customStyle={METRICS.resetPadding}
        customButtonStyle={commonStyles.input}
        value={notarizationDate}
        dateOnView={notarizationFormattedDate}
        isShowIcon
        placeholder="dd/mm/yyyy"
        timeZoneOffsetInMinutes={TIME_OFFSET_IN_MINUTE.VN}
        isRequired
        onChosen={onPickNotarizeDate}
        pickerMode={'date'}
        disabled={!editable}
        minimumDate={new Date()}
        maximumDate={null}
        error={errorNotarizeDatetime}
      />
      <View style={commonStyles.separatorRow16} />
      <InputSection
        headerTitle={translate('contactTrading.deposit.notaryOffice')}
        headerStyles={commonStyles.blackTextBold14}
        placeholder={translate('contactTrading.deposit.notaryOfficePlaceholder')}
        inputContainerStyle={commonStyles.input}
        inputStyle={[
          commonStyles.inputBorderWithIcon,
          isFocused(DEPOSIT_INPUTS2.notaryOffice) && highlightStyle,
        ]}
        value={notaryOffice}
        onChangeText={onChangeNotaryOffice}
        editable={editable}
        isRequired
        error={errorNotaryOffice}
        onFocus={() => onFocusInput(DEPOSIT_INPUTS2.notaryOffice)}
        onBlur={onBlurInput}
      />
    </View>
  );
};

const DownloadContractButton = ({onPressDownloadContract, disabled}) => {
  return (
    <TouchableOpacity
      style={[styles.downloadContractButton, disabled && styles.buttonDisabled]}
      onPress={onPressDownloadContract}
      disabled={disabled}>
      <Image source={IMAGES.DOWNLOAD_FILL} style={styles.iconDownload} resizeMode="contain" />
      <View style={commonStyles.separatorColumn8} />
      <Text style={commonStyles.mainColorTextBold14}>
        {translate('contactTrading.deposit.downloadSampleContract')}
      </Text>
    </TouchableOpacity>
  );
};
const TradingDepositInput2View = ({
  paymentProgressDtos,
  notarizationDatetime,
  notaryOffice,
  attachment,
  depositNote,
  canEdit,
  invalidPaymentDatetime,
  errors,
  onChangeItemDepositAmount,
  onChangeItemPaymentDatetime,
  onChangeItemPaymentTerms,
  onPressNewProgress,
  onPressEraseProgress,
  showAddPaymentProgressBtn,
  onPickNotarizeDate,
  onChangeNotaryOffice,
  handleOnSelectedImages,
  photoViewer,
  onPressDownloadContract,
  onChangeNote,
  isTesting,
  focusedInput,
  onFocusInput,
  onBlurInput,
}) => {
  const highlightStyle = {borderColor: COLORS.PRIMARY_A100};

  return (
    <View style={HELPERS.backgroundWhite}>
      <PaymentProgressSection
        progress={paymentProgressDtos}
        editable={canEdit && !invalidPaymentDatetime}
        errors={errors.paymentProgressDtos}
        onChangeItemDepositAmount={onChangeItemDepositAmount}
        onChangeItemPaymentDatetime={onChangeItemPaymentDatetime}
        onChangeItemPaymentTerms={onChangeItemPaymentTerms}
        onPressNewProgress={onPressNewProgress}
        onPressEraseProgress={onPressEraseProgress}
        showAddButton={showAddPaymentProgressBtn && canEdit}
        disableAddButton={invalidPaymentDatetime}
        errorButtonAdd={
          invalidPaymentDatetime ? translate('contactTrading.deposit.cantAddNewProgress') : ''
        }
        focusedInput={focusedInput}
        onFocusInput={onFocusInput}
        onBlurInput={onBlurInput}
      />
      <View style={commonStyles.separatorRow8WithColor} />
      <NotarizeTimeSection
        editable={canEdit}
        errorNotarizeDatetime={errors.notarizationDatetime}
        errorNotaryOffice={errors.notaryOffice}
        notarizationDatetime={notarizationDatetime}
        notaryOffice={notaryOffice}
        onPickNotarizeDate={onPickNotarizeDate}
        onChangeNotaryOffice={onChangeNotaryOffice}
        focusedInput={focusedInput}
        onFocusInput={onFocusInput}
        onBlurInput={onBlurInput}
      />
      <View style={commonStyles.separatorRow8WithColor} />
      <View style={styles.section}>
        {!isTesting && (
          <ImagePicker
            defaultImages={attachment || []}
            buttonTitle={translate('contactTrading.uploadFile')}
            buttonUploadStyle={styles.uploadFileBtn}
            icon={IMAGES.UPLOAD_FILL}
            pickerTitle={translate(STRINGS.PICK_PICTURE)}
            onImageChange={handleOnSelectedImages}
            onPressImage={canEdit ? null : index => photoViewer.onPressImage(index)}
            isShowOnly={!canEdit}
            hideCloseButton={!canEdit}
            titleStyle={styles.header}
            title={translate(STRINGS.TRANSACTION_FILE)}
            enableUploadFiles
          />
        )}
        {canEdit && (
          <>
            <View style={commonStyles.separatorRow16} />
            <Text style={styles.uploadFileRuleDescription}>
              {translate('contactTrading.uploadFileRuleDescription')}
            </Text>
          </>
        )}
        <View style={commonStyles.separatorRow16} />
        <DownloadContractButton onPressDownloadContract={onPressDownloadContract} />
        <View style={commonStyles.separatorRow16} />
        <InputSection
          headerTitle={translate(STRINGS.NOTE)}
          headerStyles={commonStyles.blackTextBold14}
          placeholder={translate('contactTrading.enterNote')}
          inputStyle={[
            commonStyles.multilineInput,
            focusedInput === DEPOSIT_INPUTS2.depositNote && highlightStyle,
          ]}
          value={depositNote}
          editable={canEdit}
          error={errors.note}
          onChangeText={onChangeNote}
          multiline
          showMultilineInputView
          showLimitedLength
          maxLength={MAX_LENGTH.NOTE}
          onFocus={() => onFocusInput(DEPOSIT_INPUTS2.depositNote)}
          onBlur={onBlurInput}
        />
      </View>
      <View style={commonStyles.separatorRow16} />
    </View>
  );
};

export default TradingDepositInput2View;
