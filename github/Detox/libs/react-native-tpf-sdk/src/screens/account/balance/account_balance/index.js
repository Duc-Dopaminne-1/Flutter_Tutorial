import {
  getAllGlobalCongifHandle,
  getTransactionByIdClear,
  getTransactionByIdHandle
} from '../../../../redux/actions/cashout';
import { getCommissionInformationHandle } from '../../../../redux/actions/member';
import { CASHOUT, MEMBER } from '../../../../redux/actionsType';
import { ICBalanceAccount01, ICBalanceAccount02, ICNextGreen02 } from '../../../../assets/icons';
import { WithLoading } from '../../../../components/';
import AppText from '../../../../components/app_text';
import SCREENS_NAME from '../../../../constants/screens';
import { ICON_SIZE } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import React, { useCallback, useEffect, useMemo, useContext } from 'react';
import { SafeAreaView, TouchableOpacity, View, Linking, Button, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BalanceItem from './balance_item';
import { styles } from './styles';
import Modal from 'react-native-modal';
import { useState } from 'react';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { scale } from '../../../../utils/responsive';
import themeContext from '../../../../constants/theme/themeContext';

const DEFAULT_LINKS = {
  linkUrl: 'https://htf-qa.onelink.me/JIMQ/e2b9c45c',
  advanceUrl: 'https://htf-qa.onelink.me/JIMQ/765d75ad'
};

const AccountBalance = props => {
  const theme = useContext(themeContext);
  const { navigation } = props;
  const legals = useSelector(state => state.member.legals);
  const member = useSelector(state => state.member.profile);
  const availableBalance = useSelector(state => state.member.availableBalance);
  const creditBalance = useSelector(state => state.member.creditBalance);
  const hasWithdrawalRequest = useSelector(state => state.member.hasWithdrawalRequest);
  const withdrawalTransactionId = useSelector(state => state.member.withdrawalTransactionId);
  const hasAdvanceRequest = useSelector(state => state.member.hasAdvanceRequest);
  const transactionDetail = useSelector(state => state.cashout.transactionDetail);
  const isSuccessDetail = useSelector(state => state.cashout.isSuccessDetail);
  const hasRequestRemaining = useSelector(state => state.member.hasRequestRemaining);
  const withdrawConfig = useSelector(state => state.cashout.withdrawConfig);
  const [helpBoxVisible, setHelpBoxVisible] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [marginTop, setMarginTop] = useState(0);
  const dispatch = useDispatch();

  const linkUrl = useMemo(() => {
    return !!legals?.cashoutUrl ? legals?.cashoutUrl : DEFAULT_LINKS.linkUrl;
  }, [legals]);

  const linkAdvanceSalaryUrl = useMemo(() => {
    return !!legals?.advanceUrl ? legals?.advanceUrl : DEFAULT_LINKS.advanceUrl;
  }, [legals]);

  const onPressShowDetail = useCallback(() => {
    dispatch(getTransactionByIdHandle({ Id: withdrawalTransactionId }));
  }, [withdrawalTransactionId, dispatch]);
  useEffect(() => {
    dispatch(getCommissionInformationHandle({ Id: member?.id }));
    dispatch(getAllGlobalCongifHandle());
  }, [dispatch, member?.id]);

  const onPressHelpBox = useCallback((index, width, py) => {
    setMarginTop(py - scale(3));
    setHelpBoxVisible(true);
    setItemIndex(index);
  }, []);

  const onCloseHelpBox = useCallback(() => {
    setHelpBoxVisible(false);
  }, []);

  const _dateType = useMemo(() => {
    switch (withdrawConfig?.maxNumberWithdrawalType) {
      case 1:
        return 'time.months2';
      case 2:
        return 'time.weeks';
      default:
        return '';
    }
  }, [withdrawConfig]);

  useEffect(() => {
    if (isSuccessDetail) {
      navigation.navigate(SCREENS_NAME.WITHDRAWAL_REQUEST_DETAIL, {
        transactionDetail: transactionDetail
      });
    }
  }, [isSuccessDetail, navigation, transactionDetail]);

  useEffect(() => {
    return () => {
      dispatch(getTransactionByIdClear());
    };
  }, [dispatch]);

  const openLinkWithdrawalRequest = useCallback(
    async linkUrl => {
      await Linking.openURL(linkUrl);
    },

    [linkUrl]
  );

  const openLinkAdvanceSalaryRequest = useCallback(
    async linkUrl => {
      await Linking.openURL(linkUrl);
    },

    [linkUrl]
  );
  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.balanceItems}>
        <BalanceItem
          title={'account_balance.available_balance'}
          balance={
            <AppText
              bold={false}
              translate
              numberOfLines={1}
              color={CUSTOM_COLOR.BlueStone}
              style={{
                fontSize: Math.min(
                  scale((16 * 13) / ((availableBalance?.length || 0) + 6)),
                  scale(16)
                )
              }}>
              {formatNumber(availableBalance) + ''}
              {'common.currency'}
            </AppText>
          }
          buttonLabel={'account_balance.withdrawal_request'}
          icon={<ICBalanceAccount01 color2={theme?.icon?.color1} color1={theme?.icon?.color2} />}
          onPressBtn={() => openLinkWithdrawalRequest(linkUrl)}
          availableBalance={availableBalance}
          hasWithdrawalRequest={hasWithdrawalRequest}
          disabled={!hasRequestRemaining}
          transactionTab={0}
          onPressHelpBox={onPressHelpBox}
        />
        <BalanceItem
          title={'account_balance.expected_balance'}
          balance={
            <AppText
              bold={false}
              translate
              numberOfLines={1}
              style={{
                fontSize: Math.min(scale((16 * 13) / ((creditBalance?.length || 0) + 6)), scale(16))
              }}>
              {formatNumber(creditBalance) + ''}
              {'common.currency'}
            </AppText>
          }
          buttonLabel={'account_balance.advance_salary'}
          onPressBtn={() => openLinkAdvanceSalaryRequest(linkAdvanceSalaryUrl)}
          icon={<ICBalanceAccount02 color2={theme?.icon?.color1} color1={theme?.icon?.color2} />}
          hasAdvanceRequest={hasAdvanceRequest}
          creditBalance={creditBalance}
          transactionTab={1}
          onPressHelpBox={onPressHelpBox}
        />
        {hasWithdrawalRequest ? (
          <View style={styles.textView}>
            <AppText translate style={styles.descText}>
              {'account_balance.request_processing'}
            </AppText>
            <TouchableOpacity style={styles.showDetail} onPress={onPressShowDetail}>
              <AppText translate semiBold style={styles.showDetailText}>
                {'account_balance.show_detail'}
              </AppText>
              <ICNextGreen02 height={ICON_SIZE.TINY} width={ICON_SIZE.TINY} />
            </TouchableOpacity>
          </View>
        ) : !hasRequestRemaining ? (
          <View style={styles.textView}>
            <AppText translate style={styles.descText}>
              {['account_balance.over_withdrawal', _dateType]}
            </AppText>
          </View>
        ) : null}
      </View>
      <Modal
        onBackdropPress={onCloseHelpBox}
        isVisible={helpBoxVisible}
        backdropColor={null}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{
          justifyContent: 'flex-start'
        }}>
        {itemIndex === 0 ? (
          <View style={{ marginTop }}>
            <View style={[styles.triangle, { borderBottomColor: theme.app.primaryColor3 }]} />
            <View style={[styles.noticeView, { backgroundColor: theme.app.primaryColor3 }]}>
              <AppText translate medium style={styles.notice}>
                help_box.the_balance_number_message
              </AppText>
            </View>
          </View>
        ) : (
          <View style={{ marginTop }}>
            <View
              style={[
                styles.triangle,
                { borderBottomColor: theme.app.primaryColor3 },
                styles.expectedTriangle
              ]}
            />
            <View
              style={[
                styles.noticeView,
                { backgroundColor: theme.app.primaryColor3 },
                styles.expectedNoticeView
              ]}>
              <AppText translate style={styles.notice}>
                help_box.available_balances_message
              </AppText>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};
export default WithLoading(AccountBalance, [
  MEMBER.GET_COMMISSION_INFORMATION.HANDLER,
  CASHOUT.GET_TRANSACTION_BY_ID.HANDLER
]);
