import React from 'react';
import {ImageBackground, StyleSheet, Text} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, normalMedium} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';
import styles from './styles';

const contentStyle = StyleSheet.create({
  title: {...FONTS.regular, textAlign: 'center', lineHeight: 24, fontSize: 14},
  subTitle: {
    marginVertical: normal,
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
    fontSize: 18,
  },
});
const RegisterBlock = ({onPressLogin}) => {
  return (
    <ImageBackground
      resizeMode={'contain'}
      source={IMAGES.LOGIN_BLOCK_HOME}
      style={[styles.viewSignUpContainer]}>
      <Text style={contentStyle.title}>{translate('home.loginBlock.title')}</Text>
      <Text style={contentStyle.subTitle}>{translate('home.loginBlock.subTitle')}</Text>
      <CustomButton
        onPress={onPressLogin}
        title={translate('home.loginBlock.btnLogin')}
        style={[commonStyles.buttonNext, {paddingHorizontal: normalMedium}]}
        titleStyle={{...FONTS.bold}}
      />
    </ImageBackground>
  );
};

export default React.memo(RegisterBlock);
