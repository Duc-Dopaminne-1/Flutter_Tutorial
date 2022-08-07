import { createOrEditAdvanceCommissionHandle } from '../../../../redux/actions/cashout';
import { getGetAdvanceInfoByIdHandle } from '../../../../redux/actions/member';
import { CASHOUT } from '../../../../redux/actionsType';
import { SecondaryButton, WithLoading } from '../../../../components/';
import AppText from '../../../../components/app_text';
import PrimaryButton from '../../../../components/primary_button';
import SCREENS_NAME from '../../../../constants/screens';
import { formatNumber } from '../../../../helpers/formatNumber';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './styles';
import themeContext from '../../../../constants/theme/themeContext';

const RowValueItem = React.memo(({ title, value, isLast, isBoldValue }) => {
  const { fonts } = useContext(themeContext) || {};
  const isLastItemStyle = useMemo(() => {
    return [styles.rowContent, isLast && styles.lastContent];
  }, [isLast]);
  const valueStyle = useMemo(() => {
    return [styles.text, { fontFamily: fonts.MEDIUM }, isBoldValue && { fontFamily: fonts.BOLD }];
  }, [isBoldValue]);

  return (
    <View style={isLastItemStyle}>
      <AppText translate style={styles.text} numberOfLines={1}>
        {title}
      </AppText>
      <Text style={valueStyle} numberOfLines={1}>
        {typeof value === 'number' ? (
          title === 'account_balance.tax' ? (
            <AppText translate>
              {formatNumber(-value || '0') + ''}
              {'common.currency'}
            </AppText>
          ) : (
            <AppText translate>
              {formatNumber(value || '0') + ''}
              {'common.currency'}
            </AppText>
          )
        ) : (
          value
        )}
      </Text>
    </View>
  );
});

const ConfirmAdvanceSalary = props => {
  const { navigation } = props;

  const member = useSelector(state => state.member.profile);
  const advanceInfo = useSelector(state => state.member.advanceInfo);
  const topenIdProfile = useSelector(state => state.member.topenIdProfile);
  const isSuccess = useSelector(state => state.cashout.isSuccessAdvanceCommission);
  const dispatch = useDispatch();
  const topenId = useSelector(state => state.auth.topenId);

  useEffect(() => {
    dispatch(getGetAdvanceInfoByIdHandle({ Id: member?.id }));
  }, [dispatch, member?.id]);

  const onPressCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressConfirm = useCallback(() => {
    dispatch(
      createOrEditAdvanceCommissionHandle({
        memberId: member.id,
        memberName: topenIdProfile?.name || member?.name,
        memberPhone: topenIdProfile?.phone || member?.phone,
        TopenId: topenId,
        status: 6,
        accountType: 1,
        fee: advanceInfo.advanceFee,
        amount: advanceInfo.totalAmount,
        actualAmount: advanceInfo.totalAmount - advanceInfo.advanceFee,
        listTransactionCommission: advanceInfo.advanceTransactions
      })
    );
  }, [
    advanceInfo.advanceFee,
    advanceInfo.advanceTransactions,
    advanceInfo.totalAmount,
    dispatch,
    member.id,
    topenIdProfile
  ]);

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate(SCREENS_NAME.ADVANCE_SALARY_SUCCESS_SCREEN);
    }
  }, [isSuccess, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Transaction information  */}
        <View style={styles.item}>
          <AppText translate bold={true} style={styles.title}>
            {'account_balance.transaction_info'}
          </AppText>
          <View style={styles.content}>
            <RowValueItem
              title={'confirm_advance_salary.customer_name'}
              value={advanceInfo.lastName}
            />
            <RowValueItem
              title={'confirm_advance_salary.advance_salary'}
              value={advanceInfo.totalAmount}
            />
            <RowValueItem
              title={'confirm_advance_salary.advance_salary_fee'}
              value={advanceInfo.advanceFee}
            />
            <RowValueItem
              title={'confirm_advance_salary.actual_advance_salary'}
              value={advanceInfo.totalAmount - advanceInfo.advanceFee}
              isBoldValue
            />
          </View>
        </View>
        {/* Transaction information  */}
      </ScrollView>
      <View style={styles.btnView}>
        <SecondaryButton
          translate
          title={'common.back'}
          style={styles.cancelBtn}
          onPress={onPressCancel}
        />
        <PrimaryButton
          translate
          title={'common.confirm'}
          onPress={onPressConfirm}
          style={styles.confirmBtn}
        />
      </View>
    </View>
  );
};
export default WithLoading(React.memo(ConfirmAdvanceSalary), [
  CASHOUT.CREATE_OR_EDIT_ADVANCE_COMMISSION.HANDLER
]);
