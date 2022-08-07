import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { ProfileEditCityItem } from '@/screens/Profile/ProfileEditCity/components/ProfileEditCityItem';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import IconBack from '@/components/SVG/BackSvg';

export function ProfileEditCityScreen(): ReactElement {
  useEnableHardwareBackButton();

  return (
    <View style={styles.container}>
      <SafeArea />
      <View style={styles.header}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.textTitle} title={language('editCity')} />
      </View>
      <ProfileEditCityItem />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 20,
  },
  textTitle: {
    fontSize: fonts.size.s16,
  },
});
