import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  useSendOtpToUpdateCustomerForDepositTransactionMutation,
  useUpdateCustomerInfoForDepositTransactionMutation,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {medium, normal, tiny} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import KeyboardAccessoryView from '../../../components/KeyboardAccessoryView';
import LinkTextButton from '../../../components/LinkTextButton';
import OTPTextView from '../../../components/OTPTextView';
import {AuthScreenStyles} from '../../Auth/AuthComponents/AuthScreenContants';
import {BookingContext} from '../../BookingDeposit/useBooking';

const styles = StyleSheet.create({
  bottomView: {
    flexDirection: 'row',
    padding: normal,
  },
  buttonDetailTransaction: {
    flex: 1,
    height: 45,
    borderRadius: tiny,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  textResent: {textAlign: 'center'},
  viewResentCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: medium,
    justifyContent: 'center',
  },
  contentView: {flex: 1, padding: 16, paddingTop: 32},
  description: {...FONTS.regular, marginVertical: 24},
});

const TransactionOTPScreen = ({navigation, route}) => {
  const {sendNotifyNewTransaction} = useContext(BookingContext);
  const {showErrorAlert} = useContext(AppContext);
  const {state} = route.params;
  const [verifyCode, setVerifyCode] = useState('');

  const {startApi: sendOtp} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useSendOtpToUpdateCustomerForDepositTransactionMutation,
  });

  const {startApi: updateProfileCustomer} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useUpdateCustomerInfoForDepositTransactionMutation,
  });

  const onPressResentOTP = () => {
    sendOtp(
      {
        variables: {
          request: {
            depositTransactionId: state?.depositTransactionId,
          },
        },
      },
      () => {},
    );
  };

  const onPressConfirm = () => {
    const request = {
      otpCode: verifyCode,
      ...state,
    };
    updateProfileCustomer(
      {
        variables: {
          request,
        },
      },
      response => {
        if (response.updateCustomerInfoForDepositTransaction.errorMessage) {
          showErrorAlert(response.updateCustomerInfoForDepositTransaction.errorMessage);
        } else {
          navigation.goBack();
          navigation.goBack();
          sendNotifyNewTransaction();
        }
      },
    );
  };
  return (
    <BaseScreen title={translate('common.inputOTP')}>
      <View style={styles.contentView}>
        <Text style={styles.description}>{translate('transaction.otp.description')}</Text>
        <OTPTextView
          handleTextChange={setVerifyCode}
          inputCount={6}
          keyboardType={KEY_BOARD_TYPE.OTP}
        />
        <View style={styles.viewResentCode}>
          <Text style={styles.textResent}>{translate('transaction.otp.resend')}</Text>
          <LinkTextButton onPress={onPressResentOTP} title={translate(STRINGS.SEND_AGAIN)} />
        </View>
      </View>
      <KeyboardAccessoryView style={AuthScreenStyles.bottomView}>
        {() => (
          <View style={styles.bottomView}>
            <CustomButton
              disabled={verifyCode.length < 6}
              style={[
                styles.buttonDetailTransaction,
                verifyCode.length < 6 && {backgroundColor: COLORS.TEXT_DARK_40},
              ]}
              title={translate(STRINGS.CONFIRM)}
              onPress={onPressConfirm}
            />
          </View>
        )}
      </KeyboardAccessoryView>
    </BaseScreen>
  );
};

export default TransactionOTPScreen;
