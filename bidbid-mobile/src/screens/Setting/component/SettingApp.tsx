import { language } from '@/i18n';
import SettingTitle from '@/screens/Setting/component/SettingTitle';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import NotificationsContainer from './setting-app/NotificationsContainer';
import SettingAppLanguageContainer from './setting-app/SettingAppLanguageContainer';
import ShowDistanceInContainer from './setting-app/ShowDistanceInContainer';

export function SettingApp(): ReactElement {
  return (
    <View style={styles.container}>
      <SettingTitle title={language('appSettings')} />
      <NotificationsContainer />
      <SettingAppLanguageContainer />
      <ShowDistanceInContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
