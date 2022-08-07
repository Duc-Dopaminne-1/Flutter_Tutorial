import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/vars';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { HOME_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';

function PreviewProfileButton() {
  const navigation = useNavigation();

  const userId = useSelector((state: UserInit) => {
    return state.user.data.id;
  });

  const onPress = () => {
    navigation.navigate(HOME_DETAIL_SCREEN, {
      isFromEditProfile: true,
      profileId: userId,
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <DefaultText {...{ style: styles.text }}>{language('profileGeneral.viewProfile')}</DefaultText>
    </TouchableOpacity>
  );
}

export default React.memo(PreviewProfileButton);

const styles = StyleSheet.create({
  text: {
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsMedium,
    color: colors.blue_700,
    textDecorationLine: 'underline',
  },
});
