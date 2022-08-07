import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {SERVER} from '../assets/localize/server';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, small} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import CustomIconButton from './CustomIconButton';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    marginBottom: 12,
  },
  captchaContainer: {
    ...HELPERS.fullWidth,
    borderRadius: SIZES.BORDER_RADIUS_10,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: small,
  },
  captchaView: {
    height: 95,
    width: '100%',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    overflow: 'hidden',
  },
  captchaImage: {
    width: '100%',
    height: '100%',
  },
  inputHeader: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
  },
  inputView: {
    ...METRICS.horizontalPadding,
    ...HELPERS.fill,
    borderColor: COLORS.GREY_E4,
    height: CONSTANTS.INPUT_HEIGHT,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.STATE_ERROR,
    fontSize: 12,
    ...FONTS.regular,
  },
  iconRefetch: {
    height: 20,
    width: 20,
  },
  enterCodeSection: {
    ...HELPERS.fullWidth,
  },
});

const initialState = {
  captchaBase64String: '',
  isFetching: false,
  focus: false,
};

const CaptchaVerificationSection = ({
  title,
  titleStyle,
  onEnterCode,
  onRefetchCode = () => {},
  captchaBase64String,
  error,
  containerStyle,
  inputTitleStyle,
  iconRefreshColor = COLORS.PRIMARY_A100,
  focusedColor = COLORS.PRIMARY_A100,
  captchaStyle,
  enterCodeStyle,
}) => {
  const [state, setState] = useState(initialState);
  const [captchaValue, setCaptchaValue] = useState('');

  const onEnterVerificationCode = text => {
    setCaptchaValue(text);
    onEnterCode(text);
  };

  const onRequestRefetchCode = () => {
    onRefetchCode();
    setState({...state, isFetching: true});
    onEnterVerificationCode('');
  };

  const onChangeCaptchaCode = () => {
    if (!captchaBase64String) {
      setState({captchaBase64String: '', isFetching: false});
      return;
    }
    setState({captchaBase64String: captchaBase64String, isFetching: false});
  };

  useEffect(onChangeCaptchaCode, [captchaBase64String]);

  const captchaImage = state.captchaBase64String ? (
    <Image
      source={{uri: `data:image/jpeg;base64,${state.captchaBase64String}`}}
      style={styles.captchaImage}
      resizeMode="contain"
    />
  ) : (
    <View style={HELPERS.fillCenter}>
      <Text>{translate(SERVER.system)}</Text>
    </View>
  );

  return (
    <>
      <Text style={[styles.textTitle, titleStyle]}>{title}</Text>
      <View style={[styles.captchaContainer, containerStyle]}>
        <View style={[styles.captchaView, captchaStyle]}>
          {state.isFetching ? <ActivityIndicator style={HELPERS.fill} /> : captchaImage}
        </View>
        <View style={[styles.enterCodeSection, enterCodeStyle]}>
          <View style={commonStyles.separatorRow16} />
          <Text style={[styles.inputHeader, inputTitleStyle]}>
            {translate('newPost.enterVerificationCode')} {<RequiredStar />}
          </Text>
          <View style={commonStyles.separatorRow8} />
          <View style={[HELPERS.fullWidth, HELPERS.rowStartCenter]}>
            <TextInput
              value={captchaValue}
              onChangeText={onEnterVerificationCode}
              style={[styles.inputView, state?.focus ? {borderColor: focusedColor} : null]}
              placeholder={translate('newPost.verificationCode')}
              autoCapitalize="none"
              onBlur={() => setState({...state, focus: false})}
              onFocus={() => setState({...state, focus: true})}
            />
            <View style={commonStyles.separatorColumn16} />
            <CustomIconButton
              onPress={onRequestRefetchCode}
              iconName={'refresh'}
              iconColor={iconRefreshColor}
              customImageSize={24}
            />
            <View style={commonStyles.separatorColumn8} />
          </View>
          {!!error && <Text style={styles.errorText}>{translate(error)}</Text>}
        </View>
      </View>
    </>
  );
};

export default CaptchaVerificationSection;
