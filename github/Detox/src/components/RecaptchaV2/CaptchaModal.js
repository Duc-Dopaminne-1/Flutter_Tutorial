import PropTypes from 'prop-types';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import GoogleReCaptcha from './GoogleReCaptcha';

const {width, height} = Dimensions.get('window');

const CaptchaModal = forwardRef(
  ({siteKey, baseUrl, languageCode, onMessage, cancelButtonText}, ref) => {
    const [isshowCaptcha, setShowCaptcha] = useState(false);

    const showCaptcha = () => {
      setShowCaptcha(true);
    };

    const hideCaptcha = () => {
      setShowCaptcha(false);
    };

    useImperativeHandle(ref, () => ({
      show: () => showCaptcha(),
      hide: () => hideCaptcha(),
    }));

    return (
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        deviceHeight={height}
        deviceWidth={width}
        style={styles.modal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={isshowCaptcha}>
        <View style={styles.wrapper}>
          <GoogleReCaptcha
            url={baseUrl}
            siteKey={siteKey}
            onMessage={onMessage}
            languageCode={languageCode}
            cancelButtonText={cancelButtonText}
          />
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
    marginTop: 10,
  },
  modal: {margin: 0},
  wrapper: {
    flex: 1,
    paddingTop: 150,
    backgroundColor: COLORS.BLACK_05,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

CaptchaModal.propTypes = {
  siteKey: PropTypes.string.isRequired,
  baseUrl: PropTypes.string,
  onMessage: PropTypes.func,
  languageCode: PropTypes.string,
  cancelButtonText: PropTypes.string,
};
export default CaptchaModal;
