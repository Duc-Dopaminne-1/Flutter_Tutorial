import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle, Switch } from 'react-native';
import { colors, fonts, images } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';

interface Prop {
  title: string;
  content?: string;
  containerStyle?: StyleProp<ViewStyle>;
  isEnabled: boolean;
  disabled: boolean;
  toggleSwitchCallBack?: (flag: boolean) => void;
  image?: any;
}

export function ShowMeOnBidBid(props: Prop) {
  const { title = '', containerStyle = {}, isEnabled = false, toggleSwitchCallBack = () => {}, image, disabled } = props;
  const toggleSwitch = () => {
    toggleSwitchCallBack(!isEnabled);
  };

  const opacity = disabled ? 0.5 : 1;
  return (
    <View style={[styles.container, containerStyle]}>
      {image ? image : <Image source={images.missing} style={styles.iconType} />}

      <View style={styles.wrapItem}>
        <DefaultText {...{ style: styles.textType }}>{title}</DefaultText>
      </View>
      <Switch
        style={{ opacity: opacity }}
        disabled={disabled}
        trackColor={{ false: colors.grey_alpha, true: colors.red }}
        thumbColor={isEnabled ? colors.white : colors.black}
        ios_backgroundColor={colors.grey_alpha}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
