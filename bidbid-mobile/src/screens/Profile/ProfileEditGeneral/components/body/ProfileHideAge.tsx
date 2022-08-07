import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, Switch } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import { isIOS } from '@/shared/devices';

interface Prop {
  title: string;
  content?: string;
  containerStyle?: StyleProp<ViewStyle>;
  isEnabled: boolean;
  disabled: boolean;
  toggleSwitchCallBack?: (flag: boolean) => void;
  image?: any;
}

export default function ProfileHideAge(props: Prop) {
  const { title = '', isEnabled = false, toggleSwitchCallBack = () => {}, disabled } = props;

  const toggleSwitch = () => {
    toggleSwitchCallBack(!isEnabled);
  };

  const opacity = disabled ? 0.5 : 1;
  return (
    <View style={styles.container}>
      <View>
        <DefaultText {...{ style: styles.textType }}>{title}</DefaultText>
      </View>
      <Switch
        style={[styles.wrapSwitch, { opacity: opacity }]}
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
    justifyContent: 'center',
  },
  textType: {
    fontSize: fonts.size.s16,
    marginTop: 3,
    color: colors.gray_900,
  },
  wrapSwitch: {
    alignSelf: 'center',
    marginLeft: isIOS ? 8 : 4,
    transform: [{ scale: 0.8 }],
  },
});
