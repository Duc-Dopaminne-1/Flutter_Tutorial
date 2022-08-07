import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const CreditDepositPolicy = props => {
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  const onContinue = () => {
    navigation.goBack();
  };

  const styleOrderNumber = useMemo(
    () => ({
      ...styles.sttText,
      color: theme?.app?.primaryColor1,
      fontFamily: theme?.fonts?.REGULAR
    }),
    [(styles, theme)]
  );

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <AppText translate numberOfLines={2} style={styles.textTitle}>
          {'policy_credit_deposit.title'}
        </AppText>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>1. </Text>
          <AppText translate>{'policy_credit_deposit.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>2. </Text>
          <AppText translate>{'policy_credit_deposit.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>3. </Text>
          <AppText translate>{'policy_credit_deposit.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>4. </Text>
          <AppText translate>{'policy_credit_deposit.content_04'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>5. </Text>
          <AppText translate>{'policy_credit_deposit.content_05'}</AppText>
        </Text>
      </ScrollView>

      <View style={styles.btnContainer}>
        <PrimaryButton translate title={'common.close'} onPress={onContinue} />
      </View>
    </View>
  );
};

export default CreditDepositPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  textTitle: {
    textAlign: 'center',
    marginBottom: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    fontWeight: '700'
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: scale(60),
    marginTop: SPACING.XXLarge
  },
  sttText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    fontWeight: '700'
  },
  decription: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginBottom: SPACING.Large,
    fontWeight: '400',
    textAlign: 'justify'
  },

  checkBoxIC: {
    marginTop: scale(4)
  },
  checkboxContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.Medium
  },
  textContainer: {
    flex: 1
  },
  message: {
    marginStart: SPACING.Normal,
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText
  },
  policyContainer: {
    marginBottom: scale(-3)
  },
  policy: {
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText,
    textDecorationLine: 'underline'
  },
  checkBoxView: {
    paddingBottom: SPACING.Medium,
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  btnContainer: {
    marginHorizontal: SPACING.Medium,
    marginTop: scale(32)
  }
});
