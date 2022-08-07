import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { DELETE_ACCOUNT_SCREEN } from '@/navigation/screenKeys';
import { colors } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactElement, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import IconNextRedSVG from '@/components/SVG/IconNextRedSVG';
import IconGrayDeleteSVG from '@/components/SVG/IconGrayDeleteSVG';

const DeleteAccountContainer = (): ReactElement => {
  const navigation = useNavigation();

  const onPressDeleteAccount = useCallback(() => {
    navigation.navigate(DELETE_ACCOUNT_SCREEN);
  }, []);

  return (
    <CustomItemSetting
      onPress={onPressDeleteAccount}
      containerStyle={styles.container}
      title={language('deleteAccount')}
      titleStyle={styles.textTitle}
      icon={<IconNextRedSVG />}
      image={<IconGrayDeleteSVG />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 42,
  },
  textTitle: {
    color: colors.red_700,
  },
});

export default memo(DeleteAccountContainer);
