import { useNavigation } from '@react-navigation/native';

import {
  clearInsuranceOrderResult,
  createInsurancePaymentTransactionHandle
} from '../../../redux/actions/insurance';
import { createOrEditInvoiceClear } from '../../../redux/actions/invoice';
import { AppLoading, PrimaryButton, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import { store } from '../../../redux/store/configureStore';

const InsurancePolicy = props => {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { route } = props;
  const { screenState, itemDetail } = route.params;
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onContinue = () => {
    setLoading(true);
    // payment required
    const price = screenState?.form?.ordersItem?.price || itemDetail?.ordersItem?.price || 0;
    const memberId = store.getState().auth.memberId;
    const callback = data => {
      setLoading(false);
      if (data) {
        const { urlPayment, isSandbox, tmnCode, invoiceId } = data;
        const paymentInfo = {
          amount: price,
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

  useEffect(() => {
    return () => {
      dispatch(clearInsuranceOrderResult());
      dispatch(createOrEditInvoiceClear());
    };
  }, [dispatch]);

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
      <AppLoading loading={isLoading} />
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <AppText translate numberOfLines={2} style={styles.textTitle}>
          {'policy_insuarance.title'}
        </AppText>
        <Text style={styles.introduce}>
          <AppText translate>{'policy_insuarance.introduce'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>1. </Text>
          <AppText translate>{'policy_insuarance.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>2. </Text>
          <AppText translate>{'policy_insuarance.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>3. </Text>
          <AppText translate>{'policy_insuarance.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>4. </Text>
          <AppText translate>{'policy_insuarance.content_04'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>5. </Text>
          <AppText translate>{'policy_insuarance.content_05'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>6. </Text>
          <AppText translate>{'policy_insuarance.content_06'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>7. </Text>
          <AppText translate>{'policy_insuarance.content_07'}</AppText>
        </Text>
        <Text style={[styles.noteText, { fontFamily: theme?.fonts?.ITALIC }]}>
          <AppText translate>{'policy_insuarance.note'}</AppText>
        </Text>
      </ScrollView>
      <View style={styles.textContainer}>
        <AppText>
          <SubHead translate style={styles.message} medium>
            {'policy_subscription.license_accept_02'}
          </SubHead>{' '}
          <TouchableOpacity style={styles.policyContainer} onPress={onPress}>
            <SubHead translate color={theme.app.primaryColor1} style={styles.policy} medium>
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

export default InsurancePolicy;

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
