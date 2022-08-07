import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { useSelector } from 'react-redux';
import { AppInit } from '@/redux/app/reducer';
export default function TermsText() {
  const uri = useSelector((state: AppInit) => state.app.setting.FILE_TERM_OF_SERVICE);

  const openHyperLink = async () => {
    await Linking.openURL(uri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.termsText}>
        {`${language('termsText')} `}

        <Text onPress={openHyperLink} style={styles.termsBtnText}>
          {language('termsBtnText')}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexWrap: 'wrap',
    height: 50,
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  termsText: {
    alignSelf: 'center',
    fontWeight: '400',
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    color: colors.gray_700,
    textAlign: 'center',
  },
  termsBtnText: {
    textDecorationLine: 'underline',
    fontWeight: '400',
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    color: colors.red_700,
  },
});
