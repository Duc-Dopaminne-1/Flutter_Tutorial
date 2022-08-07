import * as React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { ReactElement } from 'react';
import DefaultText from '@/components/CustomText/DefaultText';
import { isAndroid } from '@/shared/devices';

type Props = {
  leftIcon?: any;
  rightIcon?: any;
  title?: string;
  iconContainerStyle?: StyleProp<TextStyle | ViewStyle>;
  containerStyle?: ViewStyle;
  iconColor?: string;
  titleStyle?: TextStyle;
  goBack?: () => void;
  wrapIconStyle?: ViewStyle;
  onPressSubIcon?: () => void;
  children?: ReactElement;
  isShadow?: boolean;
  subButtonText?: ReactElement;
  subTitle?: string;
};

function CustomHeader(props: Props) {
  const {
    leftIcon,
    rightIcon,
    title,
    containerStyle,
    titleStyle,
    goBack,
    wrapIconStyle,
    onPressSubIcon,
    isShadow = true,
    subButtonText,
    subTitle,
  } = props;
  const navigation = useNavigation();

  const onBack = () => {
    if (goBack) {
      goBack();
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, isShadow ? styles.containerShadow : {}, containerStyle]}>
      {leftIcon && (
        <Pressable onPress={onBack} hitSlop={20} style={[styles.wrapIconLeft, wrapIconStyle]}>
          {leftIcon}
        </Pressable>
      )}
      {title && (
        <DefaultText {...{ style: Object.assign({}, styles.title, titleStyle) }}>
          {title}
          {subTitle && <Text style={styles.subTitle}> {subTitle}</Text>}
        </DefaultText>
      )}

      {rightIcon ? (
        <Pressable hitSlop={20} onPress={onPressSubIcon} style={[styles.wrapIconRight, wrapIconStyle]}>
          {rightIcon}
        </Pressable>
      ) : (
        <View style={styles.icon} />
      )}

      {subButtonText && (
        <Pressable onPress={onPressSubIcon} style={[styles.wrapSubText, wrapIconStyle]}>
          {subButtonText}
        </Pressable>
      )}
    </View>
  );
}

export default React.memo(CustomHeader);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: isAndroid ? 12 : 0,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  containerShadow: {
    zIndex: 99,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: colors.gray_shadow_beta,
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
  },
  subTitle: {
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
  },
  icon: {
    marginHorizontal: 15,
    height: 24,
    width: 24,
    tintColor: colors.text_tab,
  },
  wrapSubText: {
    paddingVertical: 5,
  },
  wrapIconLeft: {
    height: 24,
    width: 24,
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  wrapIconRight: {
    height: 24,
    width: 24,
    paddingVertical: 5,
  },
});
