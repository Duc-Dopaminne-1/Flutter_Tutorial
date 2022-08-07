import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AppContext} from '../../appData/appContext/useAppContext';
import {
  CONSTANTS,
  CONSULT_BANKLOAN_SUPPORT_TYPE,
  HOTLINE_NUMBER,
  KEY_BOARD_TYPE,
  MAX_LENGTH,
  UNIT_PERCENT,
} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../assets/theme/metric';
import CustomButton from '../../components/Button/CustomButton';
import DropdownWithTitle from '../../components/DropdownWithTitle';
import InputFormatType from '../../components/InputFormatType';
import RequiredLabel from '../../components/RequiredLabel';
import WhiteBoxInput from '../../components/WhiteBoxInput';
import Configs from '../../configs';
import {useValidateFloat} from '../../hooks';
import CallUtil from '../../utils/CallUtil';
import NumberUtils from '../../utils/NumberUtils';
import UrlUtils from '../../utils/UrlUtils';
import ScreenIds from '../ScreenIds';
import {Category, TrackingActions} from '../WithSegment';
import {ReferenceResult} from './ReferenceResult';

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 999999999999;
const DEFAULT_AMOUNT = 0;

const MIN_DURATION = 1;
const MAX_DURATION = 99;
const DEFAULT_DURATION = 1.0;

const MIN_INTEREST = 1;
const MAX_INTEREST = 30;

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: tiny,
    paddingHorizontal: normal,
  },
  buttonContainer: {
    marginTop: normal,
  },
  buttonSubmit: {
    borderRadius: SIZES.BORDER_RADIUS_8,
    paddingVertical: 13,
    backgroundColor: COLORS.GREY_ED,
  },
  buttonSubmitTitle: {
    color: COLORS.BLACK_31,
    ...FONTS.bold,
    ...FONTS.fontSize14,
  },
  unit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 45,
    marginHorizontal: small,
    justifyContent: 'center',
  },
  unitLabel: {
    ...FONTS.regular,
    color: COLORS.BLACK_31,
    fontSize: 14,
  },
  titleStyle: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.semiBold,
    marginBottom: small,
  },
  borderInputValue: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 5,
    borderColor: COLORS.GRAY_BD,
  },
  inputHeight: {height: 40},
  inputBank: {width: 100, height: 45, marginLeft: normal},
});

const valueMinMax = (value, min, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

const interestItems = [
  {name: 'Vietcombank', value: 7.0},
  {name: 'ACB', value: 7.5},
  {name: 'HSBC', value: 7.0},
];

export const LoanServicesView = ({
  customStyle,
  onChangeLoanAmount,
  onBlurAmount,
  amount,
  onChangeDuration,
  onBlurDuration,
  duration,
  interestIndex,
  onSelectedInterest,
  interestValue,
  onChangeInterestValue,
  onBlurInterestValue,
  gotoLoanDetail,
  isShowBottom,
  onPressSubmit,
}) => {
  return (
    <View style={[styles.contentContainer, customStyle]}>
      <RequiredLabel
        titleStyle={styles.titleStyle}
        title={translate('LOANS_SCREEN.TITLE_LOAN_MONEY')}
        isRequired={false}
      />
      <View style={[METRICS.marginBottom]}>
        <InputFormatType
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          editable
          textInputStyle={styles.borderInputValue}
          onChangeText={onChangeLoanAmount}
          onBlur={onBlurAmount}
          value={amount.toString()}
        />
        <View style={[styles.unit, styles.inputHeight]}>
          <Text style={styles.unitLabel}>{'VND'}</Text>
        </View>
      </View>

      <RequiredLabel
        title={translate('LOANS_SCREEN.TITLE_LOANS_DURATION')}
        titleStyle={styles.titleStyle}
        isRequired={false}
      />
      <View style={[METRICS.marginBottom]}>
        <WhiteBoxInput
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          editable
          textInputStyle={styles.borderInputValue}
          onChangeText={onChangeDuration}
          onBlur={onBlurDuration}
          value={duration.toString()}
        />
        <View style={[styles.unit, styles.inputHeight]}>
          <Text style={styles.unitLabel}>{'Năm'}</Text>
        </View>
      </View>

      <RequiredLabel
        title={translate('LOANS_SCREEN.TITLE_LOANS_INTERESTS')}
        titleStyle={[styles.titleStyle, METRICS.resetMarginBottom]}
        isRequired={false}
      />
      <View style={[HELPERS.rowMain, HELPERS.crossEnd]}>
        <DropdownWithTitle
          style={HELPERS.fill}
          headerStyles={METRICS.smallPaddingTop}
          dropdownTitle={translate('LOANS_SCREEN.LABEL_LOANS_INTERESTS')}
          popupTitle={translate('LOANS_SCREEN.LABEL_LOANS_INTERESTS')}
          items={interestItems.map((item, i) => ({
            ...item,
            id: i,
            checked: i === interestIndex,
          }))}
          inputStyle={styles.borderInputValue}
          showSearchBox={false}
          itemSelected={onSelectedInterest}
          isRequiredAtLeastOne={true}
        />
        <WhiteBoxInput
          textInputStyle={[styles.borderInputValue, styles.inputBank]}
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          value={interestValue.toString()}
          onChangeText={onChangeInterestValue}
          onBlur={onBlurInterestValue}
        />
        <View style={styles.unit}>
          <Text style={styles.unitLabel}>{UNIT_PERCENT}</Text>
        </View>
      </View>
      <ReferenceResult
        gotoLoanDetail={gotoLoanDetail}
        amount={valueMinMax(amount, MIN_AMOUNT, MAX_AMOUNT)}
        duration={valueMinMax(duration * 12, 12, duration * 12)}
        interest={valueMinMax(interestValue, MIN_INTEREST, MAX_INTEREST)}
      />
      {isShowBottom && (
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.buttonSubmit}
            titleColor={COLORS.BLACK_31}
            titleStyle={styles.buttonSubmitTitle}
            title={translate(STRINGS.SEND_REQUEST)}
            onPress={onPressSubmit}
          />
        </View>
      )}
    </View>
  );
};

const LoanServicesContainer = ({isShowBottom = true, customStyle, propertyPost}) => {
  const {track} = useAnalytics();
  const navigation = useNavigation();
  const {showErrorAlert} = useContext(AppContext);
  const [interestIndex, setInterestIndex] = useState(0);

  const {
    value: amount,
    onChange: onChangeAmount,
    onBlur: onBlurAmount,
  } = useValidateFloat(DEFAULT_AMOUNT, MIN_AMOUNT, MAX_AMOUNT, 0, MAX_AMOUNT, MAX_LENGTH.default);

  const {
    value: duration,
    onChange: onChangeDuration,
    onBlur: onBlurDuration,
  } = useValidateFloat(DEFAULT_DURATION, MIN_DURATION, MAX_DURATION);

  const {
    value: interestValue,
    setValue: setInterestValue,
    onChange: onChangeInterestValue,
    onBlur: onBlurInterestValue,
  } = useValidateFloat(interestItems[interestIndex].value, MIN_INTEREST, MAX_INTEREST);

  const onSelectedInterest = item => {
    if (typeof item.id !== CONSTANTS.UNDEFINED_STRING) {
      setInterestIndex(item.id);
      setInterestValue(interestItems[item.id].value);
    }
  };

  const gotoLoanDetail = data => {
    track(TrackingActions.loanReviewClicked, {
      category: Category.buy,
      name: propertyPost?.postTitle,
      loan_amount: NumberUtils.parseFloatValue(amount),
      loan_durataion: `${duration}`,
      loan_bank: interestItems[interestIndex].name,
      loan_interest: `${interestValue ?? 0}`,
      page_url: propertyPost?.detailPath
        ? `${Configs.portal.PORTAL_URL}${propertyPost?.detailPath}`
        : '',
    });

    navigation.navigate(ScreenIds.LoanDetail, {data});
  };

  const onChangeLoanAmount = (maskedText, rawText) => {
    let value = rawText;
    if (isNaN(rawText)) {
      value = MIN_AMOUNT;
    }
    onChangeAmount(value.toString());
  };

  const onPressHotline = () => {
    const url = CallUtil.callUrl(HOTLINE_NUMBER);
    UrlUtils.openUrl(url, () => {
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
    });
  };

  const onPressSubmit = () => {
    const bankCode = interestItems[interestIndex].name;
    const requestData = JSON.stringify({
      PropertyValue: parseFloat(amount),
      LoanPeriod: parseFloat(duration),
      InterestRate: parseFloat(interestValue),
      BankCode: bankCode,
    });
    navigation.navigate(ScreenIds.ContactToAdvice, {
      hideImage: true,
      backButtonTitle: translate(STRINGS.BACK_TO_PREVIOUS_SCREEN),
      supportRequestType: CONSULT_BANKLOAN_SUPPORT_TYPE,
      loan: requestData,
    });
  };

  return (
    <LoanServicesView
      customStyle={customStyle}
      onChangeLoanAmount={onChangeLoanAmount}
      onBlurAmount={onBlurAmount}
      amount={amount}
      onChangeDuration={onChangeDuration}
      onBlurDuration={onBlurDuration}
      duration={duration}
      interestIndex={interestIndex}
      onSelectedInterest={onSelectedInterest}
      interestValue={interestValue}
      onChangeInterestValue={onChangeInterestValue}
      onBlurInterestValue={onBlurInterestValue}
      gotoLoanDetail={gotoLoanDetail}
      isShowBottom={isShowBottom}
      onPressHotline={onPressHotline}
      onPressSubmit={onPressSubmit}
    />
  );
};

export default LoanServicesContainer;
