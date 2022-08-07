import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {medium, normal, small} from '../assets/theme/metric';
import {useCaptcha} from '../hooks/useCaptcha';
import {useMount} from '../screens/commonHooks';
import CaptchaVerificationSection from './CaptchaVerificationSection';
import CustomButton from './CustomButton';

const modalCaptchaStyles = StyleSheet.create({
  viewContainer: {paddingBottom: 0, marginTop: normal},
  viewBtnSend: {marginBottom: medium, flexDirection: 'row', flex: 1},
  cancelBtn: {flex: 1, height: 50, backgroundColor: COLORS.GREY_ED, borderRadius: small},
  btnSend: {
    flex: 1,
    borderRadius: small,
    marginLeft: normal,
    height: 50,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  enterCodeStyle: {padding: 0, marginBottom: small},
  captchaCode: {height: 70, width: '100%'},
});

const CaptchaComment = ({
  feedObjectId,
  title = translate('social.modalVerifyCode.title'),
  onVerifyCaptcha,
  errorMessage = '',
  onClose,
  disableSend,
}) => {
  const [captcha, setCaptcha] = useState('');

  const captchaHook = useCaptcha({});

  const getCaptchaImage = () => {
    captchaHook.startGetCaptchaImage({
      variables: {
        feedObjectId: feedObjectId,
      },
    });
  };

  useMount(() => {
    getCaptchaImage();
  });

  const btnStyle =
    captcha.length <= 5 || disableSend ? modalCaptchaStyles.cancelBtn : modalCaptchaStyles.btnSend;

  return (
    <>
      <CaptchaVerificationSection
        title={title}
        onEnterCode={setCaptcha}
        enterCodeStyle={modalCaptchaStyles.enterCodeStyle}
        captchaStyle={modalCaptchaStyles.captchaCode}
        captchaBase64String={captchaHook.captchaState.captchaBase64Img}
        onRefetchCode={getCaptchaImage}
      />
      <Text style={{color: COLORS.STATE_ERROR, marginBottom: small}}>{errorMessage}</Text>
      <View style={modalCaptchaStyles.viewBtnSend}>
        <CustomButton
          titleStyle={{color: COLORS.BLACK_33, ...FONTS.bold}}
          style={modalCaptchaStyles.cancelBtn}
          title={`${translate('common.cancel')}`}
          onPress={onClose}
        />
        <CustomButton
          disabled={disableSend}
          titleStyle={{color: COLORS.NEUTRAL_WHITE, ...FONTS.bold}}
          style={[modalCaptchaStyles.btnSend, btnStyle]}
          title={`${translate('social.modalVerifyCode.btnSend')}`}
          onPress={() => onVerifyCaptcha(captcha)}
        />
      </View>
    </>
  );
};

export default CaptchaComment;
