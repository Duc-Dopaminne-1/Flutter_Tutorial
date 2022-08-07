import AppText from '../../../../components/app_text';
import { formatNumber } from '../../../../helpers/formatNumber';
import { formatDate } from '../../../../helpers/formatTime';
import React, { useContext, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styles from './styles';
import themeContext from '../../../../constants/theme/themeContext';

const RowValueItem = React.memo(
  ({ title, value, isLast, isBoldValue, translateTitle = false, theme }) => {
    const { fonts } = theme || {};
    const isLastItemStyle = useMemo(() => {
      return [styles.rowContent, isLast && styles.lastContent];
    }, [isLast]);
    const valueStyle = useMemo(() => {
      return [
        styles.text,
        { fontFamily: fonts?.MEDIUM },
        isBoldValue && { fontFamily: fonts?.BOLD }
      ];
    }, [isBoldValue]);

    return (
      <View style={isLastItemStyle}>
        <AppText translate={translateTitle} style={styles.text} numberOfLines={1}>
          {title}
        </AppText>
        <Text style={valueStyle} numberOfLines={1}>
          {typeof value === 'number' ? (
            title === 'account_balance.tax' ? (
              <AppText translate>
                {formatNumber(-value) + ''}
                {'common.currency'}
              </AppText>
            ) : (
              <AppText translate>
                {formatNumber(value) + ''}
                {'common.currency'}
              </AppText>
            )
          ) : (
            value
          )}
        </Text>
      </View>
    );
  }
);

const WithdrawalRequestDetail = ({ navigation, route }) => {
  const { transactionDetail } = route.params;

  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Account information  */}
        <View style={styles.item}>
          <AppText translate bold={true} style={styles.title}>
            {'account_balance.account_info'}
          </AppText>
          <RowValueItem
            translateTitle
            title={'account_balance.bank_owner'}
            value={transactionDetail?.accountHolder}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.bank'}
            value={transactionDetail?.bank}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.bank_branch'}
            value={transactionDetail?.bankBranch}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.town_city'}
            value={transactionDetail?.bankProvince}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.bank_number'}
            value={transactionDetail?.bankAccount}
            theme={theme}
            isLast
          />
        </View>
        {/* Account information  */}
        {/* Transaction information  */}
        <View style={styles.item}>
          <AppText translate style={styles.title}>
            {'account_balance.transaction_info'}
          </AppText>
          <RowValueItem
            translateTitle
            title={'account_balance.amount'}
            value={transactionDetail?.amount || 0}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.tax'}
            value={transactionDetail?.fee || 0}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.remaining_balance'}
            value={transactionDetail?.availableBalance || 0}
            theme={theme}
          />
          <RowValueItem
            translateTitle
            title={'account_balance.actually_received'}
            value={transactionDetail?.actualAmount || 0}
            theme={theme}
            isBoldValue
          />
          <RowValueItem
            translateTitle
            title={'account_balance.received_time'}
            value={formatDate(transactionDetail?.expectedPaymentTime)}
            theme={theme}
            isLast
          />
        </View>
        {/* Transaction information  */}
      </ScrollView>
    </View>
  );
};

export default React.memo(WithdrawalRequestDetail);
