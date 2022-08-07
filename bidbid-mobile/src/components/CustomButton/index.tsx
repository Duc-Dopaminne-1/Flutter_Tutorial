import * as React from 'react';
import { ImageStyle, Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, fonts } from '@/vars';
import { Dimension } from '@/vars/dimensions';
import DefaultText from '@/components/CustomText/DefaultText';
import { isIOS } from '@/shared/devices';
import { ReactElement } from 'react';

type Props = {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  firstIcon?: any;
  wrapBtn?: ViewStyle;
  iconStyle?: ImageStyle | any;
  wrapIconStyle?: ViewStyle;
  iconSecond?: ReactElement;
  wrapSecondIconStyle?: ViewStyle;
  iconSecondStyle?: ImageStyle;
  numberOfLines?: number;
  loading?: boolean;
  disabled?: boolean;
};

function CustomButton(Props: Props) {
  const {
    onPress,
    containerStyle,
    text,
    textStyle,
    firstIcon = null,
    wrapBtn,
    iconSecond,
    wrapSecondIconStyle,
    numberOfLines = null,
    loading,
    wrapIconStyle,
  } = Props;

  return (
    <Pressable onPress={onPress} style={[styles.container, containerStyle]} disabled={loading}>
      {loading ? (
        <ActivityIndicator style={styles.loading} color={colors.white} />
      ) : (
        <>
          {firstIcon && <View style={[styles.wrapIcon, wrapIconStyle]}>{firstIcon}</View>}
          {text ? (
            <View style={[styles.btn, wrapBtn]}>
              <DefaultText numberOfLines={numberOfLines} style={[styles.text, textStyle]}>
                {text}
              </DefaultText>
            </View>
          ) : null}
          {iconSecond ? <View style={[styles.wrapIcon, wrapSecondIconStyle]}>{iconSecond}</View> : null}
        </>
      )}
    </Pressable>
  );
}

export default React.memo(CustomButton);

const styles = StyleSheet.create({
  container: {
    width: Dimension.button.medium_width,
    minHeight: Dimension.button.medium_height,
    backgroundColor: colors.red_700,
    borderRadius: Dimension.button.medium_radius,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s18,
    textAlign: 'center',
    fontWeight: isIOS ? '600' : 'bold',
  },
  wrapIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignSelf: 'center',
  },
});
