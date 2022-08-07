import { Image, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import { LOGO_WHITE } from '@src/constants/icons';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '../CustomTouchable';
import IconBadge from 'react-native-icon-badge';

export interface Props {
  mainText?: string;
  styleMainText?: object;
  mainImage?: boolean;
  leftText?: string;
  leftImage?: any;
  leftImageStyle?: object;
  leftAction?: () => void;
  rightComponent?: any;
  rightText?: string;
  rightTextStyle?: object;
  rightImage?: any;
  rightImage2?: any;
  rightImageStyle?: object;
  rightImageStyle2?: object;
  rightAction?: () => void;
  rightAction2?: () => void;
  styleHeader?: object;
  mainComponent?: any
  customComponent?: any;
  notificationBadge?: number;
}

const CustomHeader = (props: Props) => {
  const {
    mainText = '',
    styleMainText,
    mainImage,
    leftText,
    leftImage,
    leftImageStyle,
    leftAction,
    rightComponent,
    rightText,
    rightTextStyle,
    rightImage,
    rightImage2,
    rightImageStyle,
    rightImageStyle2,
    rightAction,
    rightAction2,
    styleHeader = {},
    mainComponent,
    customComponent,
    notificationBadge = 0,
  } = props;
  const [displayBadge, setDisplayBadge] = useState<string>(notificationBadge.toString());

  const formatBadge = (count: number) => {
    if (count > 99) {
      setDisplayBadge("99+");
    } else {
      setDisplayBadge(count.toString());
    }
  };
  useEffect(() => {
    formatBadge(notificationBadge);
  }, [notificationBadge]);

  return (
    <View style={[styles.headerContainer, styleHeader]}>
      <CustomTouchable onPress={leftAction}>
        {leftImage ? <Image resizeMode="contain" source={leftImage} style={[styles.imageStyle, leftImageStyle]} /> : null}
        {leftText ? <CustomText text={leftText} /> : null}
        {leftImage == null && leftText == null ? <View style={styles.leftImageInvisible} /> : null}
      </CustomTouchable>
      {mainImage ? <Image resizeMode="contain" source={LOGO_WHITE} style={styles.mainImageStyle} /> : null}
      {mainText ? <CustomText style={[styles.mainTextStyle, styleMainText]} text={mainText} /> : null}
      {customComponent}
      <View style={{ flexDirection: 'row' }}>
        <CustomTouchable style={styles.paddingIcon} onPress={rightAction2}>
          {rightImage2 ? <Image resizeMode="contain" source={rightImage2} style={[styles.imageStyle, rightImageStyle2]} /> : null}
          {rightImage2 && notificationBadge > 0 ? <View style={styles.badgeContainer}>
            <CustomText
              text={displayBadge}
              style={styles.badgeText}
            />
          </View> : null}
          {rightImage2 == null ? <View style={styles.rightImageInvisible} /> : null}

        </CustomTouchable>
        <CustomTouchable onPress={rightAction}>
          {rightImage ? <Image resizeMode="contain" source={rightImage} style={[styles.imageStyle, rightImageStyle]} /> : null}
          {rightText ? <CustomText style={rightTextStyle} text={rightText} /> : null}
          {rightComponent ? rightComponent : null}
          {rightImage == null && rightText == null && rightComponent == null ? (
            <View style={styles.rightImageInvisible} />
          ) : null}
        </CustomTouchable>
      </View>
    </View>
  );
};

export { CustomHeader };
