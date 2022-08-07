import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, Pressable, TextStyle, Image } from 'react-native';
import { colors, fonts, images } from '@/vars';
import DefaultText from '../CustomText/DefaultText';
import { language } from '@/i18n';
import { isIOS } from '@/shared/devices';
import NextSVG from '../SVG/NextSVG';

interface Prop {
  title: string;
  content?: string;
  containerStyle?: StyleProp<ViewStyle>;
  image?: any;
  titleStyle?: TextStyle;
  onPress?: () => void;
  icon?: any;
  isFromLocation?: boolean;
  countryDesc?: string;
}

function CustomItemSetting(props: Prop) {
  const {
    title = '',
    content = '',
    containerStyle = {},
    image,
    onPress,
    titleStyle = {},
    icon = <NextSVG color={colors.blue_600} />,
    isFromLocation,
    countryDesc,
  } = props;

  const renderSubTitle = () => {
    if (countryDesc) {
      return (
        <View style={styles.wrapName}>
          <DefaultText {...{ style: styles.textTypeCard }}>{countryDesc} </DefaultText>
          <View style={styles.viewDot} />
          <DefaultText {...{ style: styles.textTypeCard, numberOfLines: 1 }}>{` ${content}`}</DefaultText>
        </View>
      );
    } else {
      return (
        <View style={styles.wrapName}>
          <DefaultText {...{ style: styles.textTypeCard, numberOfLines: 1 }}>{language('myCurrentLocation')}</DefaultText>
          <View style={styles.viewDot} />
          <DefaultText {...{ style: styles.textTypeCard, numberOfLines: 1 }}>{` ${content}`}</DefaultText>
        </View>
      );
    }
  };

  return (
    <Pressable onPress={onPress} style={[styles.container, containerStyle]}>
      {image ? image : <Image source={images.missing} {...styles.iconType} />}

      <View style={styles.wrapItem}>
        <DefaultText {...{ style: [styles.textType, titleStyle] }}>{title}</DefaultText>
        {isFromLocation ? renderSubTitle() : content ? <DefaultText {...{ style: styles.textTypeCard }}>{content}</DefaultText> : null}
      </View>
      <View style={styles.wrapIconNext}>{icon}</View>
    </Pressable>
  );
}

export default CustomItemSetting;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 7,
  },
  wrapIconNext: {
    alignSelf: 'center',
  },
  wrapName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapItem: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  iconType: {
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  textType: {
    fontSize: fonts.size.s17,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  viewDot: {
    height: 4,
    width: 4,
    backgroundColor: colors.gray_500,
    borderRadius: 20,
    marginTop: isIOS ? 2 : 0,
  },
  textTypeCard: {
    fontSize: fonts.size.s14,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
    marginTop: 2,
  },
});
