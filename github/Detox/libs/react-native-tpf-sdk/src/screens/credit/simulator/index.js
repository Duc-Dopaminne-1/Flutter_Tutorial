import { useNavigation } from '@react-navigation/native';
import { logOutHandle } from '../../../redux/actions/auth';
import { ICAvailableLoan, ICNotAvailableLoan } from '../../../assets/icons';
import { PrimaryButton, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import FloatFooter from '../../../components/float_footer';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { CalculatePrincipalBalance, CalculateRemainingBalance } from '../../../utils/calculateLoan';
import { scale } from '../../../utils/responsive';
import CreditLetter from '../components/credit_letter';
import { handleTouch } from '../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../constants/analyticEnums';

const Notice = React.memo(({ isAvailable }) => {
  const _textStyle = useMemo(() => {
    return [styles.noticeText, !isAvailable && styles.notAvailableNoticeText];
  }, [isAvailable]);
  return (
    <View style={styles.noticeView}>
      {isAvailable ? <ICAvailableLoan /> : <ICNotAvailableLoan />}
      <AppText translate semiBold style={_textStyle}>
        {isAvailable ? 'loan_simulation.can_pay_back' : 'loan_simulation.can_not_pay_back'}
      </AppText>
    </View>
  );
});

const LoanSimulation = props => {
  const navigation = useNavigation();
  const { data } = props?.route.params || {};
  const dispatch = useDispatch();
  const role = useSelector(state => state.auth.role);
  const { topenId } = useSelector(state => state.auth);
  const { calculateType, duration, incomeAmount, interestRate, loanAmount, spendAmount } =
    data || {};

  const _calculateLoan = useMemo(() => {
    if (calculateType === 1) {
      return CalculatePrincipalBalance(loanAmount, interestRate, duration);
    } else {
      const temp = CalculateRemainingBalance(loanAmount, interestRate, duration);
      return temp;
    }
  }, [interestRate, loanAmount, duration, calculateType]);

  const isAvailableLoan = useMemo(() => {
    const amountPaid = _calculateLoan.totalPaid;
    const totalIncome =
      (parseFloat(incomeAmount) - parseFloat(spendAmount)) * parseInt(duration, 10);
    return amountPaid <= totalIncome;
  }, [_calculateLoan, incomeAmount, spendAmount, duration]);

  const onPressJoinNow = useCallback(() => {
    MEMBER_TYPE.Guest === role
      ? dispatch(logOutHandle())
      : props.navigation.navigate(SCREENS_NAME.CREDIT_FILTER_SCREEN);
  }, [props.navigation, role, dispatch]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <CreditLetter data={data} route={props.route} />
        <Notice isAvailable={isAvailableLoan} />
        <TouchableOpacity
          onPress={event => {
            handleTouch(
              event,
              SCREENS_NAME.LOAN_SUPPORT_SCREEN,
              props.route,
              topenId,
              EVENT_TYPE.REQUEST_SUPPORT
            );
            navigation.navigate('LoanSupportScreen', { data });
          }}>
          <SubHead translate semiBold color={TEXT_COLOR.GreenLight} style={styles.supportBtn}>
            {'loan_simulation.request_support'}
          </SubHead>
        </TouchableOpacity>
      </ScrollView>
      {isAvailableLoan && (
        <FloatFooter style={styles.bottomBtn}>
          <PrimaryButton translate title={'loan_simulation.join_now'} onPress={onPressJoinNow} />
        </FloatFooter>
      )}
    </View>
  );
};
export default React.memo(LoanSimulation);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  },
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  supportBtn: {
    textAlign: 'center',
    paddingVertical: SPACING.Large
  },
  payBackDetail: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  payBackAbility: { textAlign: 'center', marginVertical: SPACING.Medium },
  bottomBtn: {
    ...Shadow,
    paddingTop: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  noticeView: {
    padding: SPACING.Medium,
    backgroundColor: 'rgba(134, 148, 163, 0.1)',
    borderWidth: scale(1),
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS,
    borderColor: 'rgba(99, 100, 102, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noticeText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginTop: SPACING.Normal,
    textAlign: 'center'
  },
  notAvailableNoticeText: {
    color: CUSTOM_COLOR.Flamingo
  }
});
