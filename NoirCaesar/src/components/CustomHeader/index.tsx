import { Image, View, StyleProp, TextStyle, ImageSourcePropType, ImageStyle, ViewStyle, Keyboard } from 'react-native';
import React from 'react';
import styles from './styles';
import { LOGO_SMALL } from '@src/constants/icons';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '../CustomTouchable';
import { SPACING_DEFAULT } from '@src/constants/vars';

export interface Props {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  mainImage?: boolean;
  customComponent?: JSX.Element;
  leftComponent?: JSX.Element;
  leftText?: string;
  leftTextStyle?: StyleProp<TextStyle>;
  leftImage?: ImageSourcePropType;
  leftImageStyle?: StyleProp<ImageStyle>;
  leftAction?: () => void;
  rightComponent?: JSX.Element;
  rightText?: string;
  rightTextStyle?: StyleProp<TextStyle>;
  rightImage?: ImageSourcePropType;
  rightImageStyle?: StyleProp<ImageStyle>;
  rightAction?: () => void;
  rightActiveOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
  centerComponent?: JSX.Element;
  useDarkLayout?: boolean;
}

const CustomHeader = (props: Props) => {
  const {
    title,
    titleStyle,
    mainImage,
    customComponent,
    leftComponent,
    leftText,
    leftTextStyle,
    leftImage,
    leftImageStyle,
    leftAction,
    rightComponent,
    rightText,
    rightTextStyle,
    rightImage,
    rightImageStyle,
    rightAction,
    rightActiveOpacity,
    containerStyle,
    useDarkLayout,
  } = props;

  const handleRightAction = () => {
    Keyboard.dismiss();
    rightAction && rightAction();
  }

  const renderDarkLayout = () => {
    if (useDarkLayout) {
      return <View style={styles.darkLayout} />;
    }
    return null;
  };

  const renderLeftComponent = () => {
    return (
      <CustomTouchable style={[styles.subContainer, { left: SPACING_DEFAULT }]} onPress={leftAction}>
        {leftImage && <Image resizeMode="contain" source={leftImage} style={[styles.imageStyle, leftImageStyle]} />}
        {leftText && <CustomText style={leftTextStyle} text={leftText} />}
        {leftComponent}
      </CustomTouchable>
    );
  };

  const renderRightComponent = () => {
    return (
      <CustomTouchable activeOpacity={rightActiveOpacity} style={[styles.subContainer, { right: SPACING_DEFAULT }]} onPress={handleRightAction}>
        {rightImage && <Image resizeMode="contain" source={rightImage} style={[styles.imageStyle, rightImageStyle]} />}
        {rightText && <CustomText style={rightTextStyle} text={rightText} />}
        {rightComponent}
      </CustomTouchable>
    );
  };

  const renderMainView = () => {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderDarkLayout()}
        {customComponent}
        {renderLeftComponent()}
        {renderRightComponent()}
        {title && <CustomText numberOfLines={1} style={[styles.titleStyle, titleStyle]} text={title} />}
        {mainImage ? <Image resizeMode="contain" source={LOGO_SMALL} style={styles.mainImageStyle} /> : null}
        {!title && !mainImage && !customComponent && <View style={styles.transparentView} />}
      </View>
    );
  };

  return renderMainView();
};

export { CustomHeader };
