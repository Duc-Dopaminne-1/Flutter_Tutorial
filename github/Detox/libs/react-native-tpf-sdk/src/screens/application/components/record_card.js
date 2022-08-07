import { Divider, WithLoading } from '../../../components/';
import { SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import AppText from '../../../components/app_text';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useContext } from 'react';
import { PrimaryButton } from '../../../components/';
import { Shadow } from '../../../constants/stylesCSS';
import { formatDate } from '../../../helpers/formatTime';
import FastImage from 'react-native-fast-image';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import createRefundRequest from './refund_request_modal';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import {
  clearCreateOrEditTransaction,
  createOrEditTransactionHandle
} from '../../../redux/actions/cashout';
import { MEMBER_TYPE } from '../../../global/member_type';
import SCREENS_NAME from '../../../constants/screens';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import { useState } from 'react';
import { useEffect } from 'react';
import themeContext from '../../../constants/theme/themeContext';
import { CASHOUT } from '../../../redux/actionsType';

const RecordCard = props => {
  const theme = useContext(themeContext);
  const { item, onPress, tabIndex } = props;
  const navigation = useNavigation();
  const { profile, topenIdProfile } = useSelector(state => state.member);
  const dispatch = useDispatch();
  const role = useSelector(state => state.auth.role);
  const topenId = useSelector(state => state.auth.topenId);
  const isSuccess = useSelector(state => state.cashout.isSuccess);
  const depositMethod = useSelector(state => state.deposit.depositMethod);
  const isFocused = useIsFocused();
  const [typePayment, setTypePayment] = useState(0);
  const [data, setData] = useState([]);

  const stylePrimaryText = {
    color: theme?.text?.primary,
    fontFamily: theme?.fonts?.MEDIUM
  };

  const _onPress = useCallback(
    event => {
      return typeof onPress === 'function' && onPress(item, event);
    },
    [item, onPress]
  );
  const partner = useSelector(state => partnerItemSelector(state, item?.partnerId));

  useEffect(() => {
    try {
      if (depositMethod !== '[]') {
        setData(JSON.parse(depositMethod));
      } else {
        setData([]);
      }
    } catch (error) {}
  }, [depositMethod]);

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(el => {
        if (el.Code === 'PaymentAccount') {
          setTypePayment(0);
        } else {
          setTypePayment(1);
        }
      });
    }
  }, [data]);
  const refundRequest = () => {
    console.log('refundRequest', data, typePayment);
    if (data.length < 2) {
      if (typePayment === 0) {
        dispatch(
          createOrEditTransactionHandle({
            orderId: item?.id || '',
            memberId: profile?.id || '',
            isAffiliateAccount: false
          })
        );
      }
      if (typePayment === 1) {
        navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_DEPOSIT, {
          depositValue: item?.depositValue || '0',
          item
        });
      }
    } else {
      dispatch(getDepositMoneyHandler());
      createRefundRequest(
        '',
        '',
        null,
        () => {
          navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_DEPOSIT, {
            depositValue: item?.depositValue || '0',
            item
          });
        },
        () => {
          dispatch(
            createOrEditTransactionHandle({
              orderId: item?.id || '',
              memberId: profile?.id || '',
              isAffiliateAccount: false
            })
          );
        }
      );
    }
  };

  React.useEffect(() => {
    if (isSuccess && isFocused) {
      dispatch(clearCreateOrEditTransaction());
      navigation.navigate(SCREENS_NAME.REFUND_REQUEST_SUCCESS);
    }
  }, [isSuccess]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={_onPress}>
        <View style={styles.titleContainer}>
          <FastImage source={{ uri: partner?.imageLink }} style={styles.img} resizeMode="contain" />
          <AppText translate={false} semiBold style={styles.textTitle} numberOfLines={2}>
            {item?.productName}
          </AppText>
          {item?.isNew && (
            <View style={[styles.isNew, { backgroundColor: theme.app.primaryColor1 }]}>
              <AppText semiBold style={styles.newText} translate>
                common.new
              </AppText>
            </View>
          )}
        </View>
        <Divider />
        <View style={styles.contentContainer}>
          <AppText translate style={styles.textContent}>
            record_card.customer_name
          </AppText>
          <Text style={[styles.textDetail, stylePrimaryText]}>{item?.contactName}</Text>
        </View>
        <View style={styles.contentContainer}>
          <AppText translate style={styles.textContent}>
            record_card.profile_code
          </AppText>
          <Text style={[styles.textDetail, stylePrimaryText]}>{item?.orderCode || item?.code}</Text>
        </View>
        <View style={[styles.contentContainer, { paddingBottom: SPACING.XNormal }]}>
          <AppText translate style={styles.textContent}>
            record_card.update_day
          </AppText>
          <Text style={[styles.textDetail, stylePrimaryText]}>
            {formatDate(item?.lastModificationTime, 'DD/MM/YYYY')}
          </Text>
        </View>
      </TouchableOpacity>
      {[4, 5].includes(tabIndex) && data.length > 0 ? (
        <PrimaryButton
          translate
          disabled={!(item?.depositStatus === 'Deposited')}
          title={'account.refund_request'}
          style={styles.refundRequest}
          onPress={refundRequest}
        />
      ) : null}
    </View>
  );
};

export default WithLoading(RecordCard, [CASHOUT.CREATE_OR_EDIT_TRANSACTION.HANDLER]);

const styles = StyleSheet.create({
  refundRequest: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: SPACING.Medium
  },
  container: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    marginTop: SPACING.Medium,
    marginHorizontal: SPACING.Medium,
    borderRadius: 8
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.Medium,
    marginHorizontal: SPACING.Medium
  },
  textTitle: {
    flex: 1,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginHorizontal: SPACING.XNormal
  },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.XNormal,
    paddingHorizontal: SPACING.Medium
  },
  textContent: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  textDetail: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  img: {
    height: scale(44),
    width: scale(44)
  },
  isNew: {
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    alignSelf: 'flex-start'
  },
  newText: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small,
    color: CUSTOM_COLOR.White
  }
});
