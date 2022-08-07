import { createOrEditTransactionHandle } from '../../../../redux/actions/cashout';
import { CASHOUT } from '../../../../redux/actionsType';
import { WithLoading } from '../../../../components/';
import AppText from '../../../../components/app_text';
import PrimaryButton from '../../../../components/primary_button';
import SecondaryButton from '../../../../components/secondary_button';
import SCREENS_NAME from '../../../../constants/screens';
import { formatNumber } from '../../../../helpers/formatNumber';
import { formatDate } from '../../../../helpers/formatTime';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { bankSelector } from '../../../../redux/selectors/masterData';
import { MEMBER_TYPE } from '../../../../global/member_type';
import styles from './styles';
import themeContext from '../../../../constants/theme/themeContext';

const RowValueItem = React.memo(({ title, value, isLast, isBoldValue }) => {
  const { fonts } = useContext(themeContext) || {};

  const isLastItemStyle = useMemo(() => {
    return [styles.rowContent, isLast && styles.lastContent];
  }, [isLast]);
  const valueStyle = useMemo(() => {
    return [styles.text, { fontFamily: fonts?.MEDIUM }, isBoldValue && { fontFamily: fonts?.BOLD }];
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

const ConfirmWithdrawalRequest = ({ navigation, route }) => {
  const _data = route.params?.data;
  const bankListSelecter = createSelector(bankSelector, bank => bank);
  const availableBalance = useSelector(state => state.member.availableBalance);
  const withdrawConfig = useSelector(state => state.cashout.withdrawConfig);
  const bankList = useSelector(bankListSelecter) || [];
  const member = useSelector(state => state.member.profile);
  const topenIdProfile = useSelector(state => state.member.topenIdProfile);
  const topenId = useSelector(state => state.auth.topenId);
  const role = useSelector(state => state.auth.role);
  const isSuccess = useSelector(state => state.cashout.isSuccess);
  const selectedBank = bankList.filter(item => item.code === _data.bank);
  const dispatch = useDispatch();
  const onPressCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressConfirm = useCallback(() => {
    dispatch(
      createOrEditTransactionHandle({
        accountType: role === MEMBER_TYPE.Topener ? 2 : 1,
        amount: _data?.amount,
        actualAmount: _data?.received,
        isPartnerTransaction: false,
        memberId: member?.id,
        type: 2,
        vat: _data.taxRate,
        fee: _data.tax,
        topenId: topenId,
        bank: selectedBank[0]?.displayName,
        bankBranch: _data.bankBranch,
        bankProvince: _data.bankProvince,
        bankAccount: _data?.accountNumber,
        accountHolder: _data?.receiver,
        memberName: topenIdProfile?.name || member?.name,
        memberPhone: topenIdProfile?.phone || member?.phone,
        expectedPaymentTime: withdrawConfig?.estimatedDate
      })
    );
  }, [
    _data,
    dispatch,
    member?.id,
    role,
    selectedBank,
    topenIdProfile?.name,
    topenIdProfile?.phone,
    topenId,
    withdrawConfig
  ]);

  useEffect(() => {
    if (isSuccess) {
      navigation.navigate(SCREENS_NAME.WITHDRAWAL_SUCCESS);
    }
  }, [isSuccess, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Account information  */}
        <View style={styles.item}>
          <AppText translate bold={true} style={styles.title}>
            {'account_balance.account_info'}
          </AppText>
          <RowValueItem title={'account_balance.bank_owner'} value={_data?.receiver} />
          <RowValueItem
            title={'account_balance.bank'}
            value={selectedBank ? selectedBank[0]?.displayName : ''}
          />
          <RowValueItem title={'account_balance.bank_branch'} value={_data.bankBranch} />
          <RowValueItem title={'account_balance.town_city'} value={_data.bankProvince} />
          <RowValueItem title={'account_balance.bank_number'} value={_data?.accountNumber} isLast />
        </View>
        {/* Account information  */}
        {/* Transaction information  */}
        <View style={styles.item}>
          <AppText translate style={styles.title}>
            {'account_balance.transaction_info'}
          </AppText>
          <View style={styles.content}>
            <RowValueItem title={'account_balance.amount'} value={_data?.amount} />
            <RowValueItem title={'account_balance.tax'} value={_data?.tax} />
            <RowValueItem
              title={'account_balance.remaining_balance'}
              value={availableBalance - _data?.amount}
            />
            <RowValueItem
              title={'account_balance.actually_received'}
              value={_data?.received || 0}
              isBoldValue
            />
            <RowValueItem
              title={'account_balance.received_time'}
              value={formatDate(withdrawConfig?.estimatedDate)}
              isLast
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

export default WithLoading(React.memo(ConfirmWithdrawalRequest), [
  CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER
]);
