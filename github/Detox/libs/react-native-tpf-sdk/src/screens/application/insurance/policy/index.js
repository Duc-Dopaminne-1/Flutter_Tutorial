import { useNavigation } from '@react-navigation/native';
import { AppLoading, PrimaryButton, SubHead } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import React, { useCallback, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../../utils/responsive';

import { useDispatch } from 'react-redux';
import themeContext from '../../../../constants/theme/themeContext';
import { createInsurancePaymentTransactionHandle } from '../../../../redux/actions/insurance';
import { store } from '../../../../redux/store/configureStore';

const PolicyApplicationInsurance = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const [isLoading, setLoading] = useState(false);

  const { route } = props;
  const { itemDetail } = route.params;

  const onPress = useCallback(() => {
    navigation.navigate(SCREENS_NAME.TERM_AND_CONDITION_SCREEN);
  }, [navigation]);

  const onContinue = () => {
    setLoading(true);
    // payment required
    const memberId = store.getState().auth.memberId;
    const callback = data => {
      setLoading(false);
      if (data) {
        const { urlPayment, isSandbox, tmnCode, invoiceId } = data;
        const paymentInfo = {
          amount: itemDetail?.ordersItem?.price,
          paymentUrl: urlPayment,
          isSandbox,
          tmnCode,
          invoiceId
        };
        navigation.navigate(SCREENS_NAME.VN_PAY_SCREEN, {
          orderInfo: itemDetail,
          flowCode: 'InsurancePayment',
          paymentInfo
        });
      }
    };
    dispatch(
      createInsurancePaymentTransactionHandle({
        orderId: itemDetail?.orderId || '',
        memberId,
        callback
      })
    );
  };

  const styleNumberOrder = {
    ...styles.sttText,
    fontFamily: theme?.fonts?.REGULAR,
    color: theme?.app?.primaryColor1
  };
  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <AppLoading loading={isLoading} />
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <AppText translate numberOfLines={2} style={[styles.textTitle]}>
          {'policy_application_insuarance.title'}
        </AppText>
        <Text style={styles.introduce}>
          <AppText translate>{'policy_application_insuarance.introduce'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>1. </Text>
          <AppText translate>{'policy_application_insuarance.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>2. </Text>
          <AppText translate>{'policy_application_insuarance.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>3. </Text>
          <AppText translate>{'policy_application_insuarance.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>4. </Text>
          <AppText translate>{'policy_application_insuarance.content_04'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>5. </Text>
          <AppText translate>{'policy_application_insuarance.content_05'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>6. </Text>
          <AppText translate>{'policy_application_insuarance.content_06'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleNumberOrder}>7. </Text>
          <AppText translate>{'policy_application_insuarance.content_07'}</AppText>
        </Text>
        <Text style={styles.noteText}>
          <AppText italic translate>
            {'policy_application_insuarance.note'}
          </AppText>
        </Text>
      </ScrollView>
      <View style={styles.textContainer}>
        <AppText>
          <SubHead translate medium style={styles.message}>
            {'policy_subscription.license_accept_02'}
          </SubHead>{' '}
          <TouchableOpacity style={styles.policyContainer} onPress={onPress}>
            <SubHead translate medium style={[styles.policy, { color: theme?.app?.primaryColor1 }]}>
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

export default PolicyApplicationInsurance;

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
  introduce: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.Heading,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.Large
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: scale(60),
    marginTop: SPACING.XXLarge
  },
  sttText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    fontWeight: '700',
    color: CUSTOM_COLOR.BlueStone
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
    color: CUSTOM_COLOR.GreenBold,
    textAlign: 'justify'
  },
  label: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
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
    marginTop: scale(24)
  }
});
