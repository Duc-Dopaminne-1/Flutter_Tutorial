import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {useHardwareBackPress} from '../../../hooks/useHardwareBackPress';
import AuthBackButton from './AuthBackButton';
import {AuthScreenConstants} from './AuthScreenContants';

const HeaderSignUp = ({title, subTitle, iconNameRight, canGoBack = true}) => {
  useHardwareBackPress();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapperLeft}>
          {canGoBack && <AuthBackButton />}
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>
        {iconNameRight && (
          <Image source={iconNameRight} style={styles.iconStep} resizeMode="contain" />
        )}
      </View>
      {subTitle && <Text style={styles.subTitleText}>{subTitle}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...METRICS.verticalPadding,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AuthScreenConstants.CONTAINER_PADDING_LEFT,
    justifyContent: 'space-between',
  },
  wrapperLeft: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  titleText: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.TEXT_DARK_10,
    marginLeft: 20,
  },
  subTitleText: {
    marginTop: 20,
    fontSize: 14,
    ...FONTS.regular,
    paddingHorizontal: AuthScreenConstants.CONTAINER_PADDING_LEFT,
  },
  iconStep: {
    width: 42,
    height: 42,
  },
});

export default HeaderSignUp;
