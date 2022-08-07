import React, { ReactElement } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { formatPhoneNumber } from '@/shared/processing';
import NavigationActionsService from '@/navigation/navigation';
import { SIGN_UP_PHONE_SCREEN } from '@/navigation/screenKeys';
import { isIOS } from '@/shared/devices';

export function AccountSettingPhone(): ReactElement {
  const phoneNumber = useSelector((state: UserInit) => state.user.data.phoneNumber);

  const onPress = () => {
    NavigationActionsService.push(SIGN_UP_PHONE_SCREEN, {
      isChangePhone: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapItem}>
        <CustomText titleStyle={styles.txtPhoneLabel} title={language('phoneNumber')} />

        <CustomText onPress={onPress} titleStyle={styles.textEdit} title={language('edit')} />
      </View>
      <Text style={styles.txtPhone}>{formatPhoneNumber(phoneNumber ? phoneNumber : '')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtPhoneLabel: {
    fontSize: fonts.size.s16,
    fontWeight: isIOS ? '600' : 'bold',
    color: colors.gray_900,
  },
  txtPhone: {
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_600,
    marginTop: 5,
  },
  textEdit: {
    fontSize: fonts.size.s12,
    color: colors.red_700,
  },
});
