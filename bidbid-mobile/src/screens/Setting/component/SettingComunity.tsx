import { language } from '@/i18n';
import { SettingAppVersion } from '@/screens/Setting/component/community/SettingAppVersion';
import SettingTitle from '@/screens/Setting/component/SettingTitle';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import DeleteAccountContainer from './community/DeleteAccountContainer';
import LogoutContainer from './community/LogoutContainer';
import ShareBidBidContainer from './community/ShareBidBidContainer';

export function SettingComunity(): ReactElement {
  return (
    <View style={styles.container}>
      <SettingTitle title={language('community')} />
      <ShareBidBidContainer />
      <LogoutContainer />
      <SettingAppVersion />
      <DeleteAccountContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
