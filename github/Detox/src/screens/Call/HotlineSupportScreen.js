import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import InputSection from '../../components/InputSection';
import {SizeBox} from '../../components/SizeBox';
import {getConfigs} from '../../configs';
import ScreenIds from '../ScreenIds';
import {StringeeContext} from './StringeeContext';

export const HotlineSupportScreen = ({navigation, route}) => {
  const {phoneNumber} = route?.params ?? {};
  const {callHotline} = useContext(StringeeContext);

  const onPressCall = () => {
    callHotline();
  };

  const onPressChat = () => {
    navigation.navigate(ScreenIds.LiveChatSupport);
  };

  return (
    <BaseScreen testID={ScreenIds.HotlineSupport} title={translate('hotlineSupport.screenTitle')}>
      <View style={styles.banner}>
        <Image source={IMAGES.ILLUS_SUPPORT} />
        <View style={HELPERS.fillCol}>
          <Text style={styles.hotlineNumber}>{getConfigs().stringee.HOTLINE_NUMBER}</Text>
          <Text style={styles.supportCustomer}>
            {translate('hotlineSupport.suportCustomerViaVideoCall')}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.fullyFree}>{translate('hotlineSupport.alwaysFree')}</Text>
        <Text style={styles.pleaseConnectHeadphone}>
          {translate('hotlineSupport.pleaseConnectHeadphone')}
        </Text>

        <InputSection
          headerTitle={translate(STRINGS.YOUR_PHONE_NUMBER)}
          headerStyles={styles.phoneNumberHeader}
          isRequired
          inputStyle={{...commonStyles.inputBorder}}
          value={phoneNumber}
          editable={false}
        />

        <View style={HELPERS.fill} />
        <CustomButton
          mode="primary"
          title={translate('hotlineSupport.buttonCall')}
          leftChild={<Image source={IMAGES.CALL_IC_VIDEO} style={styles.colorImgCall} />}
          onPress={onPressCall}
        />
        <SizeBox height={SIZES.SEPARATOR_16} />
        <View style={HELPERS.rowCenter}>
          <View style={styles.separator} />
          <Text style={styles.orText}>{translate('hotlineSupport.textOr')}</Text>
          <View style={styles.separator} />
        </View>
        <SizeBox height={SIZES.SEPARATOR_16} />
        <CustomButton
          mode="primary"
          title={translate('hotlineSupport.buttonChat')}
          style={styles.btnMessage}
          titleStyle={styles.textBtnMessage}
          leftChild={<Image source={IMAGES.MESSAGE_FILL} style={styles.colorImgMessage} />}
          onPress={onPressChat}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  banner: {
    flexDirection: 'row',
    paddingTop: SIZES.PADDING_16,
    paddingHorizontal: SIZES.PADDING_16,
    backgroundColor: COLORS.PRIMARY_A20,
  },
  hotlineNumber: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_24,
    color: COLORS.BLACK_31,
  },
  supportCustomer: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.BLACK_31,
  },
  fullyFree: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_24,
    color: COLORS.BLACK_31,
  },
  pleaseConnectHeadphone: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.BLACK_31,
    marginTop: small,
    marginBottom: 40,
  },
  phoneNumberHeader: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    color: COLORS.BLACK_31,
  },
  orText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.GRAY_A3,
    marginHorizontal: 25,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GREY_F0,
  },
  colorImgCall: {
    tintColor: COLORS.NEUTRAL_WHITE,
  },
  btnMessage: {backgroundColor: COLORS.TEXT_GRAY_50},
  colorImgMessage: {
    tintColor: COLORS.PRIMARY_A100,
  },
  textBtnMessage: {
    color: COLORS.PRIMARY_A100,
  },
});
