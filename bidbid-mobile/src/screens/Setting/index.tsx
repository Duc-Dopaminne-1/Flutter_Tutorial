import React, { ReactElement, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors } from '@/vars';
import SettingAccount from '@/screens/Setting/component/SettingAccount';
import { SettingDiscovery } from '@/screens/Setting/component/SettingDiscovery';
import { SettingPayment } from '@/screens/Setting/component/SettingPayment';
import { SettingApp } from '@/screens/Setting/component/SettingApp';
import { getUser } from '@/redux/user/actions';
import NavigationActionsService from '@/navigation/navigation';
import { getNotificationSetting } from '@/redux/notification/actions';
import { isIOS } from '@/shared/devices';
import { getAllPayment } from '@/redux/payment/actions';
import { useDispatch, useSelector } from 'react-redux';
import { SettingBanner } from '@/screens/Setting/component/SettingBanner';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import { RootState } from '@/redux/reducers';
import { SettingComunity } from './component/SettingComunity';
import IconBack from '@/components/SVG/BackSvg';

export function SettingScreen(): ReactElement {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => {
    return state.app.locale;
  });
  const [, setForceUpdate] = useState(Date.now());

  useEnableHardwareBackButton();

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getUser({
        onSuccess: () => undefined,
        onFail: () => undefined,
      }),
    );
    NavigationActionsService.dispatchAction(getNotificationSetting());
  }, []);

  useEffect(() => {
    dispatch(getAllPayment({}));
  }, []);

  useEffect(() => {
    setTimeout(() => setForceUpdate(Date.now()), 100);
  }, [locale]);

  return (
    <View style={styles.container}>
      <SafeArea />
      <SettingBanner />
      <CustomHeader
        leftIcon={<IconBack />}
        title={language('settings')}
        titleStyle={styles.textTitle}
        iconContainerStyle={styles.iconContainerStyle}
      />
      <ScrollView>
        <SettingAccount />
        <SettingDiscovery />
        <SettingApp />
        <SettingPayment />
        <SettingComunity />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  iconContainerStyle: {
    marginHorizontal: 14,
  },

  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  },
});
