import { useNavigation } from '@react-navigation/native';
import { PrimaryButton, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

const CreditPolicy = props => {
  const navigation = useNavigation();
  const { route } = props;
  const { form, backToProfileScreen } = route.params;
  const role = useSelector(state => state.auth.role);
  const { depositMoney } = useSelector(state => state.deposit);
  const theme = useContext(themeContext);

  const onContinue = useCallback(() => {
    emitEvent({ event_name: SDK_EVENT_NAME.CREDIT_APPLICATION_UPDATE, data: form });
    if (depositMoney && role === MEMBER_TYPE.Member) {
      navigation.navigate(SCREENS_NAME.CONFIRM_CREDIT_ORDER_SCREEN, {
        form: form,
        backToProfileScreen
      });
      return;
    }

    navigation.navigate(SCREENS_NAME.CONFIRM_CREDIT_ORDER_TOPENER_SCREEN, {
      form: form
    });
  }, [form, navigation, role]);

  const onPress = useCallback(() => {
    navigation.navigate(SCREENS_NAME.TERM_AND_CONDITION_SCREEN);
  }, [navigation]);

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
          {'policy_credit.title'}
        </AppText>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>1. </Text>
          <AppText translate>{'policy_credit.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>2. </Text>
          <AppText translate>{'policy_credit.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>3. </Text>
          <AppText translate>{'policy_credit.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>4. </Text>
          <AppText translate>{'policy_credit.content_04'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>5. </Text>
          <AppText translate>{'policy_credit.content_05'}</AppText>
        </Text>
        <Text style={[styles.noteText, { fontFamily: theme?.app?.ITALIC }]}>
          <AppText translate>{'policy_credit.note'}</AppText>
        </Text>
      </ScrollView>
      <View style={styles.textContainer}>
        <AppText>
          <SubHead translate style={styles.message} medium>
            {'policy_subscription.license_accept_02'}
          </SubHead>{' '}
          <TouchableOpacity style={styles.policyContainer} onPress={onPress}>
            <SubHead translate color={theme?.app?.primaryColor1} style={styles.policy} medium>
              {'account.policy'}
            </SubHead>
          </TouchableOpacity>
        </AppText>
      </View>
      <View style={styles.btnContainer}>
        <PrimaryButton translate title={'policy_subscription.continue'} onPress={onContinue} />
      </View>
    </View>
  );
};

export default CreditPolicy;

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
  noteText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'justify'
  },

  checkBoxIC: {
    marginTop: scale(4)
  },
  textContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.Medium,
    paddingTop: SPACING.Fit
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
    marginTop: scale(24),
    paddingBottom: SPACING.Medium
  }
});
