import React, {useEffect, useRef, useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';

import {DEFAULT_COUNT_DOWN_TIME_OTP, KEY_BOARD_TYPE} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {medium, normal, tiny} from '../../../../assets/theme/metric';
import BaseScreen from '../../../../components/BaseScreen';
import CustomButton from '../../../../components/Button/CustomButton';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import KeyboardAccessoryView from '../../../../components/KeyboardAccessoryView';
import LinkTextButton from '../../../../components/LinkTextButton';
import OTPTextView from '../../../../components/OTPTextView';

const styles = StyleSheet.create({
  bottomView: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: normal,
  },
  buttonDetailTransaction: {
    marginBottom: SIZES.MARGIN_16,
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
  contentView: {flex: 1, padding: SIZES.PADDING_16, paddingTop: 32},
  description: {...FONTS.regular, marginVertical: 24},
  titleTime: {textAlign: 'left', marginBottom: SIZES.MARGIN_16},
  textTime: {color: COLORS.PRIMARY_B100, ...FONTS.bold},
});

const useCountDownOTP = ({visible, onPressResentOTP, initCountDownTime}) => {
  const resendOtpTimerInterval = useRef();
  const [time, setTime] = useState(initCountDownTime);

  useEffect(() => {
    if (visible) {
      countDownTime();
    } else {
      setTime(initCountDownTime);
      clearCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const resentOtp = () => {
    clearCountdown();
    setTime(initCountDownTime);
    countDownTime();
    onPressResentOTP();
  };

  const clearCountdown = () => {
    clearInterval(resendOtpTimerInterval.current);
  };

  const countDownTime = () => {
    resendOtpTimerInterval.current = setInterval(() => {
      setTime(prev => {
        if (prev === 0) {
          clearCountdown();
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  };

  return {resentOtp, time};
};

export const ModalConfirmOTP = ({
  error,
  onDismissError,
  onPressResentOTP,
  onConfirmed,
  isShowModalOTP,
  onDismissModal,
  initCountDownTime = DEFAULT_COUNT_DOWN_TIME_OTP,
  ...props
}) => {
  const {time, resentOtp} = useCountDownOTP({
    initCountDownTime,
    onPressResentOTP,
    onDismissModal,
    visible: props.visible,
  });

  const [verifyCode, setVerifyCode] = useState('');

  const onPressConfirm = () => {
    onConfirmed(verifyCode);
  };

  return (
    <Modal animationType="slide" {...props}>
      <BaseScreen title={translate('transaction.otp.title')} onBackPress={onDismissModal}>
        <View style={styles.contentView}>
          <Text style={styles.description}>{translate('transaction.otp.description')}</Text>
          <Text style={styles.titleTime}>
            {translate('transaction.otp.expireText')}
            <Text style={styles.textTime}>
              {time
                ? `${time} ${translate('transaction.otp.seconds')}`
                : translate('transaction.otp.timeOut')}
            </Text>
          </Text>
          <OTPTextView
            handleTextChange={setVerifyCode}
            inputCount={6}
            keyboardType={KEY_BOARD_TYPE.OTP}
          />
          <View style={styles.viewResentCode}>
            <Text style={styles.textResent}>{translate('transaction.otp.resend')}</Text>
            <LinkTextButton
              disable={time}
              onPress={resentOtp}
              title={translate(STRINGS.SEND_AGAIN)}
            />
          </View>
        </View>
        <KeyboardAccessoryView enableOnAndroid={false} style={styles.bottomView}>
          {() => (
            <CustomButton
              mode="primary"
              disabled={verifyCode.length < 6 || time === 0}
              style={[
                styles.buttonDetailTransaction,
                verifyCode.length < 6 && {backgroundColor: COLORS.TEXT_DARK_40},
              ]}
              title={translate(STRINGS.CONFIRM)}
              onPress={onPressConfirm}
            />
          )}
        </KeyboardAccessoryView>
        {error ? (
          <ConfirmDialog
            isVisible={true}
            title={translate(STRINGS.DEFAULT_MODAL_TITLE)}
            okText={translate(STRINGS.CLOSE)}
            message={error}
            onDismiss={onDismissError}
          />
        ) : null}
      </BaseScreen>
    </Modal>
  );
};
