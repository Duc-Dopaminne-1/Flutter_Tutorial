import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { CreditCardInput } from 'react-native-credit-card-input';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import TermText from '@/components/PaymentAddCard';
import { isIOS, isIphoneX } from '@/shared/devices';
import ErrorMessage from '@/components/ErrorMessage';
import stripe from 'tipsi-stripe';
import NavigationActionsService from '@/navigation/navigation';
import { createCard, getClientSecret } from '@/redux/payment/actions';
import { alertError } from '@/shared/alert';
import { useAlertMessage } from '@/constants/messageConstants';
import { ErrorCode } from '@/constants/codeError';
import IconBack from '@/components/SVG/BackSvg';

let cardInfo = null;

export function PaymentAddCardScreen(): ReactElement {
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<ScrollView>(null);
  const alertMessage = useAlertMessage();
  const textError = isError ? alertMessage.ERROR_MESSAGE_FORMAT : '';
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onShowKeyboard);

    return () => {
      Keyboard.removeListener('keyboardDidShow', onShowKeyboard);
    };
  }, []);

  const onShowKeyboard = () => {
    inputRef.current?.scrollToEnd({ animated: true });
  };

  const onChange = data => {
    if (isError) {
      setIsError(false);
    }
    cardInfo = data;
  };

  const validateCard = () => {
    if (cardInfo === null || (cardInfo && !cardInfo.valid)) {
      if (!isError) {
        setIsError(true);
      }
      return true;
    }
    return false;
  };

  const addCard = async (clientKey, paymentMethod) => {
    let paymentIntent = null;
    try {
      paymentIntent = await stripe.confirmSetupIntent({
        paymentMethodId: paymentMethod.id,
        savePaymentMethod: true,
        clientSecret: clientKey,
      });
    } catch (err) {
      NavigationActionsService.hideLoading();
      alertError(err.toString());
    }

    paymentIntent &&
      NavigationActionsService.dispatchAction(
        createCard({
          paymentMethodId: paymentMethod.id,
          onSuccess: () => {
            cardInfo = null;
            NavigationActionsService.hideLoading();
            NavigationActionsService.goBack();
          },
          onFail: (err: any) => {
            NavigationActionsService.hideLoading();
            if (err === ErrorCode.PAYMENT_METHOD_EXISTED) {
              alertError(language('paymentExisted'));
              return;
            }
            alertError(err);
          },
        }),
      );
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (validateCard()) {
      return;
    }
    setIsError(false);
    NavigationActionsService.showLoading();

    const { number, name, cvc, expiry } = cardInfo.values;
    const expiryDate = expiry.split('/');

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: {
          number,
          cvc,
          expMonth: parseInt(expiryDate[0]),
          expYear: parseInt(expiryDate[1]),
        },
        billingDetails: {
          name: name.trim(),
        },
      });
      NavigationActionsService.dispatchAction(
        getClientSecret({
          onSuccess: data => {
            addCard(data.client_secret, paymentMethod);
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            alertError(error.toString());
          },
        }),
      );
    } catch (e) {
      NavigationActionsService.hideLoading();
      alertError(e.toString());
    }
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('addCreditCard')} />
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
        <ScrollView ref={inputRef} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.wrapCard}>
          <CreditCardInput
            requiresName
            cardImageFront={images.bgCard}
            cardFontFamily={fonts.family.PlayBold}
            labelStyle={styles.wrapLabel}
            inputStyle={styles.wrapInput}
            onChange={onChange}
            labels={{
              name: language('cardInput.name'),
              number: language('cardInput.number'),
              expiry: language('cardInput.expiry'),
              cvc: language('cardInput.cvc'),
              postalCode: language('cardInput.postalCode'),
            }}
            placeholders={{
              name: language('cardInput.fullName'),
              number: '**** **** **** ****',
              expiry: 'MM/YY',
              cvc: language('cardInput.cvc'),
              postalCode: '34567',
            }}
            cardholderLabel={language('cardHolderName')}
            expireLabel={language('expire')}
          />
          <ErrorMessage style={styles.wrapError} errorValue={textError} />
        </ScrollView>
        <TermText />
        <CustomButton onPress={handleSubmit} containerStyle={styles.btnContinue} text={language('save')} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapLabel: {
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
    fontSize: fonts.size.s16,
    marginBottom: 8,
  },
  wrapInput: {
    borderWidth: 1,
    borderRadius: 10,
    fontFamily: fonts.family.PoppinsRegular,
    borderColor: colors.gray_400,
    paddingHorizontal: 10,
    fontSize: fonts.size.s14,
  },
  wrapError: {
    marginTop: 5,
  },
  wrapCard: {
    flex: 1,
    marginTop: 30,
  },
  btnContinue: {
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginBottom: isIphoneX() ? 40 : 30,
    marginHorizontal: 15,
    width: null,
    borderRadius: 36,
  },
});
