import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import {useLogin} from '../../Auth/useLogin';

const IMAGE_SIZE = SCREEN_SIZE.HEIGHT / 2.2;

const styles = StyleSheet.create({
  headerContainer: {
    ...HELPERS.row,
    ...METRICS.horizontalMargin,
    ...HELPERS.center,
    marginTop: 20,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 24,
    marginBottom: 10,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: normal,
    alignItems: 'center',
  },
  description: {
    ...FONTS.regular,
    marginVertical: normal,
    fontSize: 15,
    lineHeight: 21,
  },
  buttonRight: {
    ...commonStyles.buttonNext,
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: normal,
    width: 220,
  },
  titleButtonLogin: {
    ...FONTS.semiBold,
  },
});

export const RequiredLogin = ({title}) => {
  const {showLogin} = useLogin();

  const onPress = () => {
    showLogin(() => {});
  };

  return (
    <SafeAreaScreenContainer>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.description}>{translate(STRINGS.REQUIRED_LOGIN_DESCRIPTION)}</Text>
        <Image style={{height: IMAGE_SIZE}} resizeMode={'contain'} source={IMAGES.LOGIN_BG} />
        <CustomButton
          style={styles.buttonRight}
          titleStyle={styles.titleButtonLogin}
          title={translate(STRINGS.REQUIRED_LOGIN_NOW)}
          onPress={onPress}
        />
      </View>
    </SafeAreaScreenContainer>
  );
};

export const Transaction2Screen = () => {
  return <RequiredLogin title={translate(STRINGS.TRANSACTION)} />;
};

export const Notification2Screen = () => {
  return <RequiredLogin title={translate(STRINGS.NOTIFICATION)} />;
};
