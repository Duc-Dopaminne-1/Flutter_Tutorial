import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import {SizeBox} from '../../components/SizeBox';
import {FeatureConfig} from '../../configs/FeatureConfig';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import styles from './styles';

const sizeIcon = 44;
const size = SCREEN_SIZE.WIDTH / 7;
const margin = SCREEN_SIZE.WIDTH / 14 - size / 7;
const Button = ({text, imageSource, backgroundColor, style, onPress}) => {
  return (
    <View style={buttonStyles.container}>
      <TouchableOpacity
        style={[
          {
            backgroundColor: backgroundColor,
            ...buttonStyles.icon,
          },
          style,
        ]}
        onPress={onPress}>
        <Image source={imageSource} style={styles.sectionIcons} resizeMode="contain" />
      </TouchableOpacity>
      <SizeBox height={SIZES.SEPARATOR_4} />
      <Text style={[buttonStyles.buttonText, {width: size + 15}]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const ButtonGroup = ({
  openSearchB2C,
  onPressKnowledge,
  openSearchC2C,
  onPressService,
  onPressUtilities360,
  onPressNews,
}) => {
  const buttons = [
    {
      text: translate('home.top.project'),
      imageSource: IMAGES.IC_BUILDING_FILL,
      onPress: openSearchB2C,
      backgroundColor: COLORS.PRIMARY_A20,
      enable: true,
    },
    {
      text: translate('home.top.propertyPost'),
      imageSource: IMAGES.IC_HOUSE_FILL,
      onPress: openSearchC2C,
      backgroundColor: COLORS.PRIMARY_B20,
      enable: true,
    },
    {
      text: translate('home.top.services'),
      imageSource: IMAGES.IC_MESSAGE_QUESTION_FILL,
      onPress: onPressService,
      backgroundColor: COLORS.PURPLE_80,
      enable: true,
    },
    {
      text: translate('home.top.utilities360'),
      imageSource: IMAGES.IC_UTILITIES_FILL,
      onPress: onPressUtilities360,
      backgroundColor: COLORS.BLUE_80,
      enable: true,
    },
    {
      text: translate('home.top.news'),
      imageSource: IMAGES.IC_TINTUC_FILL,
      onPress: onPressNews,
      backgroundColor: COLORS.GREEN_80,
      enable: FeatureConfig.enableNews,
    },
    {
      text: translate('home.top.knowledge'),
      imageSource: IMAGES.IC_TEACHER_FILL,
      onPress: onPressKnowledge,
      backgroundColor: COLORS.YELLOW_80,
      enable: true,
    },
  ];

  const ListButtonsActive = buttons.filter(button => button.enable);

  return (
    <View style={styles.buttonGroup}>
      <ScrollView
        contentContainerStyle={{paddingLeft: normal}}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {ListButtonsActive.map(e => {
          return <Button {...e} key={e.text} />;
        })}
      </ScrollView>
    </View>
  );
};

const buttonStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: size,
    marginRight: margin,
  },
  icon: {
    width: sizeIcon,
    height: sizeIcon,
    borderRadius: sizeIcon / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_BLACK,
    textAlign: 'center',
  },
});

export default ButtonGroup;
