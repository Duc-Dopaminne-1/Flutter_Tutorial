import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {KEY_BOARD_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {FONTS} from '../../../assets/theme/fonts';
import {medium, METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import InputSection from '../../../components/InputSection';
import {getDateBefore} from '../../../utils/TimerCommon';
import ValidateInput from '../../../utils/ValidateInput';
import FooterButtons from '../../ManagePost/NewPost/NewPostComponents/FooterButtons';
import {NewPostStyles} from '../../ManagePost/NewPost/NewPostComponents/NewPostConstant';

const LIMIT_RANGE_DATE = 30;

export const getInitialFilterState = () => {
  return {
    statusIds: [],
    typeIds: [],
    fromDate: getDateBefore(LIMIT_RANGE_DATE).toISOString(),
    toDate: new Date().toISOString(),
  };
};

const SubscribeModal = forwardRef(({onPressApply = () => {}, onPressCancel = () => {}}, ref) => {
  const [email, setEmail] = useState({value: '', error: null});

  const onChangeEmail = text => {
    setEmail({...email, value: text, error: null});
  };

  const validateForm = () => {
    const errorEmail = ValidateInput.checkEmail(email.value);
    setEmail({...email, error: errorEmail});
    if (errorEmail) return false;
    return true;
  };

  const applyModal = () => {
    if (validateForm()) {
      onPressApply({email: email.value, isRequiredToUseCaptcha: false});
    }
  };

  useImperativeHandle(ref, () => ({
    apply: isRequiredToUseCaptcha => {
      if (validateForm()) {
        onPressApply({email: email.value, isRequiredToUseCaptcha});
      }
      return null;
    },
  }));

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>{translate('news.receiveTitle')}</Text>
        <Text style={styles.subTitleText}>{translate('news.receiveSubTitle')}</Text>
        <InputSection
          placeholder={translate('news.emailPlaceholder')}
          isRequired={true}
          keyboardType={KEY_BOARD_TYPE.EMAIL}
          value={email.value}
          inputStyle={{...commonStyles.inputBorder}}
          onChangeText={onChangeEmail}
          error={email.error}
        />
      </View>
      <View
        style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth, METRICS.marginBottom]}>
        <FooterButtons
          nextButtonTitle={translate(STRINGS.SIGNUP)}
          onPressNext={applyModal}
          onPressCancel={onPressCancel}
          cancelButtonTitle={translate(STRINGS.DISCARD)}
          cancelTextStyle={commonStyles.blackTextBold14}
          cancelButtonStyle={NewPostStyles.backGrayNonBorder}
        />
      </View>
    </>
  );
});

export default SubscribeModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    ...METRICS.padding,
  },
  titleText: {
    ...FONTS.semiBold,
    fontSize: 24,
    marginEnd: medium,
  },
  subTitleText: {
    ...FONTS.regular,
    fontSize: 16,
    marginEnd: medium,
    marginTop: medium,
  },
});
