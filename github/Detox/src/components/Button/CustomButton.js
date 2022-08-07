import React from 'react';
import {
  ColorValue,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Insets,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {IconButton} from 'react-native-paper';

import {CONSTANTS} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';

type Mode = 'default' | 'primary' | 'outline' | 'icon';
type BorderStyle = 'solid' | 'dotted' | 'dashed';

export type CustomButtonProps = {
  mode: Mode,
  style: ViewStyle,
  title: String,
  titleStyle: ViewStyle,
  borderStyle: BorderStyle,
  onPress: Function,
  disabled: Boolean,
  iconName: String,
  iconSize: Number,
  iconColor: ColorValue,
  iconLeftSource: ImageSourcePropType,
  iconLeftStyle: ImageStyle,
  hitSlop: Insets,
  hasNextArrow: Boolean,
  leftChild: JSX.Element,
  rightChild: JSX.Element,
  borderStyle: BorderStyle,
  disabledStyle: ViewStyle,
  imageName: String,
  icon: JSX.Element,
  size: Number,
  imageStyle: ImageStyle,
};

const CustomButton = ({
  mode = 'default',
  title,
  titleColor = COLORS.NEUTRAL_WHITE,
  onPress = () => {},
  disabled = false,
  iconSize = 14,
  iconColor = COLORS.PRIMARY_A100,
  style,
  titleStyle,
  iconName,
  iconLeftSource,
  iconLeftStyle,
  hitSlop,
  hasNextArrow,
  leftChild,
  rightChild,
  borderStyle,
  disabledStyle,
  imageName,
  icon,
  size = 24,
  imageStyle,
  ...otherPropButton
}: CustomButtonProps) => {
  switch (mode) {
    case 'default':
      return (
        <DefaultButton
          style={style}
          title={title}
          titleStyle={titleStyle}
          titleColor={titleColor}
          onPress={onPress}
          disabled={disabled}
          iconName={iconName}
          iconSize={iconSize}
          iconColor={iconColor}
          iconLeftSource={iconLeftSource}
          iconLeftStyle={iconLeftStyle}
          hitSlop={hitSlop}
          hasNextArrow={hasNextArrow}
          {...otherPropButton}
        />
      );
    case 'primary':
      return (
        <PrimaryButton
          title={title}
          titleStyle={titleStyle}
          style={style}
          leftChild={leftChild}
          rightChild={rightChild}
          onPress={onPress}
          hitSlop={hitSlop}
          disabled={disabled}
          disabledStyle={disabledStyle}
          {...otherPropButton}
        />
      );
    case 'outline':
      return (
        <PrimaryOutlineButton
          title={title}
          titleStyle={titleStyle}
          borderStyle={borderStyle}
          style={style}
          leftChild={leftChild}
          rightChild={rightChild}
          onPress={onPress}
          hitSlop={hitSlop}
          disabled={disabled}
          disabledStyle={disabledStyle}
          {...otherPropButton}
        />
      );
    case 'icon':
      return (
        <ImageIconButton
          size={size}
          imageName={imageName}
          imageStyle={imageStyle}
          icon={icon}
          onPress={onPress}
          style={style}
          {...otherPropButton}
        />
      );
    default:
      throw new Error(mode);
  }
};

const DefaultButton = ({
  style,
  title,
  titleStyle,
  titleColor,
  onPress,
  disabled,
  iconName,
  iconSize,
  iconColor,
  iconLeftSource,
  iconLeftStyle,
  hitSlop,
  hasNextArrow,
  ...otherPropButton
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[defaultStyles.container, HELPERS.center, style]}
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      {...otherPropButton}>
      {iconName && (
        <IconButton icon={iconName} color={iconColor} size={iconSize} style={defaultStyles.icon} />
      )}
      {!!title && (
        <Text style={[defaultStyles.defaultTitleStyle, {color: titleColor}, titleStyle]}>
          {title}
        </Text>
      )}
      {iconLeftSource && <Image source={iconLeftSource} style={iconLeftStyle} />}
      {hasNextArrow && (
        <IconButton
          icon="chevron-right"
          color={COLORS.NEUTRAL_WHITE}
          size={14}
          style={defaultStyles.arrowNextIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const PrimaryButton = ({
  title,
  titleStyle,
  style,
  leftChild,
  rightChild,
  onPress,
  hitSlop,
  disabled,
  disabledStyle,
  ...otherPropButton
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        primaryStyles.container,
        style,
        disabled ? disabledStyle || primaryStyles.btnDisabled : {},
      ]}
      onPress={onPress}
      hitSlop={hitSlop}
      disabled={disabled}
      {...otherPropButton}>
      {leftChild}
      <Text style={[primaryStyles.title, titleStyle]}>{title}</Text>
      {rightChild}
    </TouchableOpacity>
  );
};

const PrimaryOutlineButton = ({
  titleStyle,
  borderStyle = 'solid',
  style,
  ...props
}: CustomButtonProps) => {
  return (
    <PrimaryButton
      titleStyle={{...outlineStyles.title, ...titleStyle}}
      style={{...outlineStyles.container, borderStyle, ...style}}
      {...props}
    />
  );
};

const ImageIconButton = ({
  imageName,
  size,
  imageStyle,
  icon,
  onPress,
  style,
  ...otherPropButton
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      hitSlop={CONSTANTS.HIT_SLOP}
      onPress={onPress}
      style={style}
      {...otherPropButton}>
      {imageName ? (
        <Image
          source={imageName}
          resizeMode="contain"
          style={[imageIconStyles.imageIcon(size), imageStyle]}
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  defaultTitleStyle: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    marginHorizontal: SIZES.MARGIN_8,
    color: COLORS.NEUTRAL_WHITE,
  },
  icon: {
    margin: 0,
  },
  arrowNextIcon: {
    margin: 0,
    padding: 0,
    right: 19,
    position: 'absolute',
  },
});
const primaryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_RADIUS_8,
    backgroundColor: COLORS.PRIMARY_A100,
    height: 48,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
    marginHorizontal: SIZES.MARGIN_8,
    color: COLORS.NEUTRAL_WHITE,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
const outlineStyles = StyleSheet.create({
  container: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.TRANSPARENT,
  },
  title: {
    color: COLORS.PRIMARY_A100,
  },
});

const imageIconStyles = StyleSheet.create({
  imageIcon: size => ({
    width: size,
    height: size,
  }),
});

export default CustomButton;
