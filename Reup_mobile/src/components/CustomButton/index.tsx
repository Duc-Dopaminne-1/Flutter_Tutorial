import { TextStyle, ViewStyle, StyleProp, View, Text, Image, ImageSourcePropType, ImageStyle, TouchableOpacity } from 'react-native';
import styles from './styles';
import React from 'react';
import { CustomTouchable } from '../CustomTouchable';
import ICON_FACEBOOK from '@res/iconSocial/facebook.png';
import ICON_GOOGLE from '@res/icons/google.png';
import { CustomText } from '../CustomText';
import translate from '@src/localize';
interface CustomButtonProps {
  style?: StyleProp<ViewStyle>;
  text?: string;
  disabled?: boolean;
  textStyle?: TextStyle | TextStyle[];
  onPress?: () => void;
  activeOpacity?: number;
  secondText?: string;
  secondTextStyle?: TextStyle;
  iconLeft?: ImageSourcePropType;
  iconRight?: ImageSourcePropType;
  iconLeftStyle?: ImageStyle;
  iconRightStyle?: ImageStyle;
}

interface StatisticsButtonProps {
  style?: StyleProp<ViewStyle>;
  text: string;
  textStyle?: TextStyle;
  disabled?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
  statisticsNumber: string;
  statisticsStyle?: TextStyle;
}

const CustomButton = (props: CustomButtonProps) => {
  const { onPress, style, text, disabled = false, textStyle, activeOpacity, iconLeft, iconRight, iconLeftStyle, iconRightStyle } = props;

  const renderIconLeft = () => {
    return iconLeft && <Image source={iconLeft} resizeMode={'contain'} style={[styles.iconLeft, iconLeftStyle ? iconLeftStyle : {}]} />;
  };
  const renderIconRight = () => {
    return iconRight && <Image source={iconRight} resizeMode={'contain'} style={[styles.iconRight, iconRightStyle ? iconRightStyle : {}]} />;
  };

  const renderText = () => {
    if (text !== '') {
      return <CustomText numberOfLines={1} style={[styles.text, textStyle]} text={text} />;
    } else {
      return null;
    }
  };

  return (
    <CustomTouchable
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styles.content}>
        {renderIconLeft()}
        {renderText()}
        {renderIconRight()}
      </View>
    </CustomTouchable>
  );
};

const StatisticsButton = (props: StatisticsButtonProps) => {
  const { style, text, textStyle, disabled, onPress, activeOpacity, statisticsNumber, statisticsStyle } = props;
  return (
    <CustomTouchable
      style={[styles.statisticsContainer, { opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styles.statisticsContent}>
        <View pointerEvents="none">
          <CustomTouchable style={styles.roundButton}>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[styles.statisticsText, statisticsStyle]}>
              {statisticsNumber}
            </Text>
          </CustomTouchable>
        </View>
        <CustomText text={text} style={[styles.statisticsText, styles.textMargin, textStyle]} numberOfLines={1} />
      </View>
    </CustomTouchable>
  );
};

interface SocialButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  isLogin?: boolean;
}

const FacebookButton = (props: SocialButtonProps) => {
  const { onPress, style, isLogin = true } = props;

  return (
    <View style={[styles.containerSocialButton, style]}>
      <CustomTouchable style={[styles.customTouchableSocialButton, styles.customTouchableFacebookButton]} onPress={onPress}>
        <View style={styles.linearGradientFacebookButton}>
          <Image source={ICON_FACEBOOK} resizeMode="contain" style={styles.iconSocialButton} />
          <View style={styles.viewTextSocialButton}>
            <Text numberOfLines={1} style={styles.textFacebookButton} allowFontScaling={true} adjustsFontSizeToFit={true}>
              {isLogin ? translate('authentication.sign_in_with_facebook') : translate('authentication.sign_up_with_facebook')}
            </Text>
          </View>
        </View>
      </CustomTouchable>
    </View>
  );
};

const GoogleButton = (props: SocialButtonProps) => {
  const { onPress, style, isLogin = true } = props;

  return (
    <View style={[style]}>
      <CustomTouchable style={styles.customTouchableSocialButton} onPress={onPress}>
        <View style={styles.linearGradientGoogleButton}>
          <Image source={ICON_GOOGLE} resizeMode="contain" style={styles.iconSocialButton} />
          <View style={styles.viewTextSocialButton}>
            <Text numberOfLines={1} style={styles.textSocialButton} allowFontScaling={false} adjustsFontSizeToFit={true}>
              {isLogin ? translate('authentication.sign_in_with_google') : translate('authentication.sign_up_with_google')}
            </Text>
          </View>
        </View>
      </CustomTouchable>
    </View>
  );
};

interface ImageButtonProps {
  onPress: () => void;
  icon: ImageSourcePropType;
  styleIcon?: ImageStyle | ImageStyle[];
  styleContainer?: ViewStyle | ViewStyle[];
}

const ImageButton = (props: ImageButtonProps) => {

  const { onPress, icon, styleContainer, styleIcon } = props;

  return (
    <CustomTouchable onPress={onPress} style={[styles.containerImageBtn, styleContainer]}>
      <Image source={icon} resizeMode={'contain'} style={[styles.imageImageBtn, styleIcon]} />
    </CustomTouchable>
  );
};

export { CustomButton, FacebookButton, GoogleButton, StatisticsButton, ImageButton };
