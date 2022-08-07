import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { NotificationSettingList } from '@/screens/NotificationSetting/component/NotificationSettingList';
import IconBack from '@/components/SVG/BackSvg';

export function NotificationSettingScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('notifications')} />
      <NotificationSettingList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
