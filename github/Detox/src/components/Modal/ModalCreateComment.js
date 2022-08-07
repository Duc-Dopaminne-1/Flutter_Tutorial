import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {medium, normal, small} from '../../assets/theme/metric';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import CustomButton from '../Button/CustomButton';
import KeyboardAccessoryView from '../KeyboardAccessoryView';
import {Captcha} from '../RecaptchaV2/Captcha';
import ModalWithModalize from './ModalWithModalize';

const styles = StyleSheet.create({
  titleModalComment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textComment: {...FONTS.bold, fontSize: 24},
  btnSend: {
    height: 50,
    borderRadius: small,
    backgroundColor: COLORS.PRIMARY_A100,
    margin: normal,
  },
  inputStyle: {
    minHeight: 60,
    maxHeight: SCREEN_SIZE.HEIGHT * 0.25,
    paddingBottom: small,
    marginBottom: normal,
  },
});

const bottomButtonSpace = Platform.OS === 'ios' ? 40 : 80;

const ModalCreateComment = ({isShowCaptcha, onRequestCommentWithCaptcha, modalRef}) => {
  const [message, setMessage] = useState('');
  const [height, setHeight] = useState(80);
  const captchaRef = useRef(null);
  const disableButton = message.length <= 5;

  const btnStyle = disableButton
    ? [styles.btnSend, {backgroundColor: COLORS.GRAY_A0}]
    : styles.btnSend;

  useEffect(() => {
    if (isShowCaptcha) {
      captchaRef?.current?.show(captcha => onRequestCommentWithCaptcha(message, captcha));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowCaptcha]);

  const onPressSend = () => {
    if (isShowCaptcha) {
      captchaRef?.current?.show(captcha => onRequestCommentWithCaptcha(message, captcha));
    } else {
      onRequestCommentWithCaptcha(message);
    }
  };

  const onClosedModal = () => {
    setMessage('');
  };

  return (
    <ModalWithModalize
      onClosed={onClosedModal}
      modalTopOffset={50}
      withReactModal
      scrollViewProps={{scrollEnabled: false}}
      getModalRef={modalRef}>
      <Captcha ref={captchaRef}>
        <View style={{height: SCREEN_SIZE.HEIGHT * 0.8, padding: normal, paddingTop: medium}}>
          <View style={styles.titleModalComment}>
            <Text style={styles.textComment}>{translate('social.modalMessage.title')}</Text>
            <Text onPress={() => modalRef?.current?.close()} style={{color: COLORS.PRIMARY_A100}}>
              {translate(STRINGS.CLOSE)}
            </Text>
          </View>
          <TextInput
            message={message}
            maxLength={300}
            autoFocus
            onChangeText={setMessage}
            style={[styles.inputStyle, {height: height}]}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            multiline
            placeholder={translate('social.comment.placeHolder')}
          />
        </View>
      </Captcha>
      <KeyboardAccessoryView inSafeAreaView bumperHeight={bottomButtonSpace}>
        {() => (
          <CustomButton
            disabled={disableButton}
            onPress={() => onPressSend()}
            title={translate('social.modalVerifyCode.btnSend')}
            style={btnStyle}
          />
        )}
      </KeyboardAccessoryView>
    </ModalWithModalize>
  );
};

export default React.memo(ModalCreateComment);
