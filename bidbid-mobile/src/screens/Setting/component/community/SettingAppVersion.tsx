import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/vars/imagesSvg';
import { colors } from '@/vars';
import { APP_VERSION } from '@/constants/app';
import { language } from '@/i18n';

export function SettingAppVersion(): ReactElement {
  return (
    <View style={styles.container}>
      <AppIcon />
      <Text style={styles.textVersion}>
        {language('appVersion', {
          version: APP_VERSION,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 12,
  },
  textVersion: {
    marginTop: 12,
    fontSize: 17,
    color: colors.black,
  },
});
