import React from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import { language } from '@/i18n';

interface CustomSwitchProps {
  title: string;
  isEnabled: boolean;
  disabled: boolean;
  toggleSwitchCallBack?: (flag: boolean) => void;
}

export function CustomSwitch(props: CustomSwitchProps) {
  const { title = '', isEnabled = false, toggleSwitchCallBack = () => {}, disabled } = props;
  const opacity = disabled ? 0.5 : 1;

  const toggleSwitch = () => {
    toggleSwitchCallBack(!isEnabled);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftView}>
        <DefaultText {...{ style: styles.textType }}>{title}</DefaultText>
        <DefaultText {...{ style: styles.description }}>{language('goingGlobal')}</DefaultText>
      </View>
      <View style={styles.rightView}>
        <Switch
          style={{ opacity }}
          disabled={disabled}
          trackColor={{ false: colors.grey_alpha, true: colors.red }}
          thumbColor={isEnabled ? colors.white : colors.black}
          ios_backgroundColor={colors.grey_alpha}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftView: {
    flex: 1,
    paddingVertical: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  rightView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  textType: {
    fontSize: fonts.size.s17,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
  description: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
    marginTop: 6,
  },
});
