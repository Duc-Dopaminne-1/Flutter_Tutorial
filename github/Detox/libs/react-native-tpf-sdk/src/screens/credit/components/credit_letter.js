import { useNavigation } from '@react-navigation/native';
import { ICNext } from '../../../assets/icons';
import { RowSpace, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { formatNumber } from '../../../helpers/formatNumber';
import React, { useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalculateTypeItems, TermItems } from '../../../global/loan';
import { translate } from '../../../i18n';
import { CalculatePrincipalBalance, CalculateRemainingBalance } from '../../../utils/calculateLoan';
import { handleTouch } from '../../../helpers/handleTouch';
import { useSelector } from 'react-redux';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import themeContext from '../../../constants/theme/themeContext';

const Item = React.memo(({ title, value }) => {
  return (
    <View style={styles.item}>
      <AppText translate style={styles.titleItem}>
        {title}
      </AppText>
      <RowSpace height={SPACING.Small} />
      <AppText medium style={styles.valueItem}>
        {value}
      </AppText>
    </View>
  );
});

const CreditLetter = ({ route, data, isSupport = false }) => {
  const navigation = useNavigation();
  const { fonts } = useContext(themeContext) || {};
  const {
    calculateType,
    duration,
    incomeAmount,
    interestRate,
    loanAmount,
    paymentTerm,
    spendAmount
  } = data || {};
  const { topenId } = useSelector(state => state.auth);
  const _paymentTerm = useMemo(() => {
    const result = TermItems.find(item => item?.code === paymentTerm);
    return result?.displayName || '';
  }, [paymentTerm]);
  const _calculateType = useMemo(() => {
    const result = CalculateTypeItems.find(item => item?.code === calculateType);
    return result?.displayName || '';
  }, [calculateType]);
  const _calculateLoan = useMemo(() => {
    if (calculateType === 1) {
      return CalculatePrincipalBalance(loanAmount, interestRate, duration);
    } else {
      return CalculateRemainingBalance(loanAmount, interestRate, duration);
    }
  }, [interestRate, loanAmount, duration, calculateType]);
  return (
    <View style={styles.payBackDetail}>
      {isSupport && (
        <AppText translate bold={true} style={styles.title}>
          {'loan_support.need_detail'}
        </AppText>
      )}
      <Item
        translate
        title={'loan_package.loan_title'}
        value={formatNumber(loanAmount) + ' ' + translate('common.currency')}
      />
      <Item
        translate
        title={'loan_package.borrowed_time_title'}
        value={(duration || 0) + ' ' + translate('time.months')}
      />
      <Item translate title={'loan.interest_rate'} value={`${interestRate}%`} />
      <Item translate title={'loan.compound'} value={translate(_paymentTerm)} />
      <Item
        translate
        title={'loan_package.monthly_income'}
        value={
          <AppText translate>
            {formatNumber(Math.round(incomeAmount || ''))}
            {'common.currency'}
          </AppText>
        }
      />
      <Item
        translate
        title={'loan_package.monthly_details'}
        value={
          <AppText translate>
            {formatNumber(Math.round(spendAmount || ''))}
            {'common.currency'}
          </AppText>
        }
      />
      <Item translate title={'loan_package.calculation'} value={translate(_calculateType)} />
      {!isSupport ? (
        calculateType === 1 ? (
          <>
            <Item
              translate
              title={'loan_package.monthly_interest_amount'}
              value={
                <AppText translate>
                  {formatNumber(_calculateLoan?.interestPaidMonthly?.toFixed(0) || '0')}
                  {'common.currency'}
                </AppText>
              }
            />
            <Item
              translate
              title={'loan_package.principal_amount'}
              value={
                <AppText translate>
                  {formatNumber(_calculateLoan?.principalPaidMonthly?.toFixed(0) || '0')}
                  {'common.currency'}
                </AppText>
              }
            />
          </>
        ) : (
          <>
            <Item
              translate
              title={'loan_package.first_month_s_profit'}
              value={
                <AppText translate>
                  {formatNumber(_calculateLoan?.firstMonthInterest?.toFixed(0) || '0')}
                  {'common.currency'}
                </AppText>
              }
            />
            <Item
              translate
              title={'loan_package.principal_amount'}
              value={
                <AppText translate>
                  {formatNumber(_calculateLoan?.principalPaidMonthly?.toFixed(0) || '0')}
                  {'common.currency'}
                </AppText>
              }
            />
            <Item
              translate
              title={'loan_package.total_interest_payable'}
              value={
                <AppText translate>
                  {formatNumber(_calculateLoan?.totalInterestPaid?.toFixed(0) || '0')}
                  {'common.currency'}
                </AppText>
              }
            />
          </>
        )
      ) : null}
      {!isSupport && (
        <View style={styles.item}>
          <AppText translate style={styles.titleItem}>
            {'loan_package.total'}
          </AppText>
          <RowSpace height={SPACING.Small} />
          <AppText translate style={[styles.valueItem, { fontFamily: fonts?.BOLD }]}>
            {formatNumber(Math.round(_calculateLoan.totalPaid))}
            {'common.currency'}
          </AppText>
        </View>
      )}
      {!isSupport && (
        <TouchableOpacity
          style={styles.view_detail}
          onPress={event => {
            handleTouch(event, 'REQUEST_SUPPORT', route, topenId, EVENT_TYPE.REQUEST_SUPPORT);
            navigation.navigate(SCREENS_NAME.PAY_BACK_DETAIL_SCREEN, {
              data: { ...data, _calculateLoan }
            });
          }}>
          <SubHead translate color={TEXT_COLOR.GreenLight} semiBold>
            {'loan_simulation.view_pay_back_detail'}
          </SubHead>
          <ICNext color={CUSTOM_COLOR.PersianGreen} style={styles.next} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CreditLetter);

const styles = StyleSheet.create({
  payBackDetail: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  payBackAbility: { textAlign: 'center', marginVertical: SPACING.Medium },
  titleItem: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold
  },
  valueItem: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  item: {
    marginBottom: SPACING.XNormal
  },
  title: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.BlueStone,
    marginBottom: SPACING.Medium
  },
  view_detail: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  next: {
    marginLeft: SPACING.Small
  }
});
