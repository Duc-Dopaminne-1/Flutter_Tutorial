import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { CustomLine } from '@/components/CustomeLine';
import { TextButton } from '@/components/TextButton';
import { useNavigation } from '@react-navigation/native';
import { signUpPhone } from '@/redux/auth/actions';
import { SIGN_UP_VERIFY_SMS_SCREEN } from '@/navigation/screenKeys';
import { alertError } from '@/shared/alert';
import DefaultText from '@/components/CustomText/DefaultText';
import { DevENV, formatPhoneNumber } from '@/shared/processing';

function ConfirmUserItem() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phoneNumber, firstName, photos } = useSelector((state: UserInit) => state.user.data);
  const avatar = photos ? photos[0]?.url : '';

  const onNotMe = () => {
    navigation.goBack();
  };

  const onPhoneSuccess = (resultApi: any) => {
    if (DevENV()) {
      alert(resultApi.code);
    }
    navigation.navigate(SIGN_UP_VERIFY_SMS_SCREEN, {
      isAutoLinkSocial: true,
      isChangePhone: false,
      phone: phoneNumber,
      token: resultApi.token,
    });
  };

  const onPhoneFail = (error: any) => {
    alertError(error, language('error'), null);
  };

  const onContinue = () => {
    dispatch(
      signUpPhone({
        param: {
          phoneNumber,
        },
        onSuccess: resultApi => onPhoneSuccess(resultApi),
        onFail: onPhoneFail,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapTextInput}>
        <View style={styles.wrapAvatar}>
          {firstName && avatar && (
            <>
              <Image source={{ uri: avatar }} style={styles.avatar} resizeMode={'cover'} />
              <DefaultText style={styles.textName}>{firstName}</DefaultText>
            </>
          )}
        </View>
        {firstName && avatar && <CustomLine lineStyle={styles.line} />}
        <DefaultText style={styles.textConfirm}>{language('confirmPhone')}</DefaultText>
        <DefaultText style={styles.textPhone}>{formatPhoneNumber(phoneNumber)}</DefaultText>
      </View>
      <CustomButton onPress={onContinue} containerStyle={styles.btnContinue} text={language('continue')} />
      <TextButton onPress={onNotMe} textButton={language('notMe')} containerStyle={styles.wrapNotMe} />
    </View>
  );
}

export default React.memo(ConfirmUserItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapTextInput: {
    paddingHorizontal: 24,
    marginTop: 64,
    marginHorizontal: 24,
    backgroundColor: colors.white,
    paddingVertical: 24,
    elevation: 12,
    borderRadius: 12,
    shadowColor: colors.gray_product,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },
  btnContinue: {
    marginTop: 50,
    alignSelf: 'center',
    marginHorizontal: 40,
  },
  line: {
    marginVertical: 16,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 10,
    marginRight: 16,
  },
  textName: {
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsSemiBold,
    color: colors.gray_900,
  },
  textConfirm: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
    fontFamily: fonts.family.PoppinsMedium,
  },
  textPhone: {
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
    marginTop: 5,
  },
  wrapNotMe: {
    alignSelf: 'center',
    marginTop: 24,
  },
});
