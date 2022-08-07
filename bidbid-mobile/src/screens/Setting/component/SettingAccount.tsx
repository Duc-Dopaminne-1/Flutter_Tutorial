import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import SettingTitle from '@/screens/Setting/component/SettingTitle';
import CustomItemSetting from '@/components/CustomItemSetting';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import NavigationActionsService from '@/navigation/navigation';
import { ACCOUNT_SETTING_SCREEN } from '@/navigation/screenKeys';
import { formatPhoneNumber } from '@/shared/processing';
import IconGrayPhoneSVG from '@/components/SVG/IconGrayPhoneSVG';

function SettingAccount(): ReactElement {
  const phoneNumber = useSelector((state: UserInit) => state.user.data.phoneNumber);

  const onPress = () => {
    NavigationActionsService.push(ACCOUNT_SETTING_SCREEN);
  };

  return (
    <View style={styles.container}>
      <SettingTitle title={language('accountSettings')} />
      <CustomItemSetting
        onPress={onPress}
        title={language('phoneNumber')}
        content={formatPhoneNumber(phoneNumber)}
        image={<IconGrayPhoneSVG />}
      />
    </View>
  );
}

export default SettingAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
