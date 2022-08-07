import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { colors } from '@/vars';
import CustomHeader from '@/components/CustomHeader';
import { AccountSettingPhone } from '@/screens/AccountSetting/component/AccountSettingPhone';
import { SafeArea } from '@/components/SafeArea';
import { AccountSettingSocial } from '@/screens/AccountSetting/component/AccountSettingSocial';
import IconBack from '@/components/SVG/BackSvg';

export function AccountSettingScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('accountSettings')} />
      <AccountSettingPhone />
      <AccountSettingSocial />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
