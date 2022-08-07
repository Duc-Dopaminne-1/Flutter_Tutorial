import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { useSelector } from 'react-redux';
import { IAuthState } from '@/redux/auth/reducer';
import { RuleSocial } from '@/constants/app';
import DefaultText from '@/components/CustomText/DefaultText';

interface Props {
  onContinue?: any;
  isSuccess?: boolean;
}

function SignUpVerifySmsModal(props: Props): ReactElement {
  const { onContinue, isSuccess = true } = props;
  const typeSocial = useSelector((state: IAuthState) => state.auth.social.type);
  const title = isSuccess ? language('connectSuccess') : language('connectFail');
  const nameSocial = RuleSocial.Facebook === typeSocial ? 'FaceBook' : RuleSocial.Google === typeSocial ? 'Google' : 'Apple';
  const note = isSuccess ? language('noteConnectSuccess', { nameSocial }) : language('noteConnectFail', { nameSocial });
  const textBtn = isSuccess ? language('continue') : language('tryAgain');

  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <DefaultText {...{ style: styles.textTitle }}>{title}</DefaultText>
        <DefaultText {...{ style: styles.textNote }}>{note}</DefaultText>
      </View>
      <CustomButton onPress={onContinue} containerStyle={styles.btnContinue} text={textBtn} />
    </View>
  );
}

export default React.memo(SignUpVerifySmsModal);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContinue: {
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginHorizontal: 35,
  },
  wrapTitle: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 31,
  },
  textTitle: {
    fontSize: fonts.size.s20,
    fontFamily: fonts.family.PoppinsBold,
    color: colors.gray_900,
    textAlign: 'center',
  },
  textNote: {
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
    color: colors.gray_500,
    marginTop: 12,
    textAlign: 'center',
  },
});
