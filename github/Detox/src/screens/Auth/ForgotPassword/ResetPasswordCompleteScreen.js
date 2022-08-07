import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal} from '../../../assets/theme/metric';
import CustomButton from '../../../components/Button/CustomButton';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {resetNavigatorToScreen} from '../../navigate';
import ScreenIds from '../../ScreenIds';
import {AuthScreenStyles} from '../AuthComponents/AuthScreenContants';

const styles = StyleSheet.create({
  viewContainer: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    ...FONTS.semiBold,
    fontSize: 24,
    marginBottom: 16,
  },
  imageTick: {
    marginTop: 40,
    marginBottom: 24,
    width: 83,
    height: 83,
  },
  textSubtitle: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.TEXT_DARK_10,
  },
  button: {
    ...METRICS.smallNormalVerticalPadding,
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  wrapperButton: {padding: normal, borderTopColor: COLORS.NEUTRAL_DIVIDER, borderTopWidth: 1},
});

const ResetPasswordCompleteScreen = ({navigation}) => {
  const onPressButton = () => {
    resetNavigatorToScreen(navigation, ScreenIds.Login);
  };
  return (
    <SafeAreaScreenContainer
      style={AuthScreenStyles.safeArea}
      testID={ScreenIds.ResetPasswordComplete}>
      <View style={styles.viewContainer}>
        <Image style={styles.imageTick} source={IMAGES.IC_SUCCESS_FILL} resizeMode="contain" />
        <Text style={styles.textTitle}>{translate('resetPasswordComplete.title')}</Text>
        <Text style={styles.textSubtitle}>{translate('resetPasswordComplete.subTitle')}</Text>
      </View>
      <View style={styles.wrapperButton}>
        <CustomButton
          title={translate('resetPasswordComplete.button.login')}
          style={styles.button}
          titleStyle={{...FONTS.bold}}
          onPress={onPressButton}
        />
      </View>
    </SafeAreaScreenContainer>
  );
};

export default ResetPasswordCompleteScreen;
