import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { isIOS, isIphoneX } from '@/shared/devices';
import { validateEmail } from '@/shared/processing';
import NavigationActionsService from '@/navigation/navigation';
import { updatePaypal } from '@/redux/payment/actions';
import { alertError } from '@/shared/alert';
import { CreditCardInput } from 'react-native-credit-card-input';
import ErrorMessage from '@/components/ErrorMessage';
import { useAlertMessage } from '@/constants/messageConstants';
import { useRoute } from '@react-navigation/native';
import { PAYMENT_ACCOUNTS_SCREEN } from '@/navigation/screenKeys';
import IconBack from '@/components/SVG/BackSvg';

let textInput = '';

export function PaymentUpdatePaypalScreen(): ReactElement {
  const [isError, setIsError] = useState(false);
  const { email, id } = useRoute().params as any;
  const alertMessage = useAlertMessage();

  useEffect(() => {
    textInput = email;
  }, [email]);

  const handleSubmit = () => {
    if (validateCard()) {
      return;
    }
    setIsError(false);

    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      updatePaypal({
        id,
        email: textInput,
        onSuccess: () => {
          textInput = null;
          NavigationActionsService.hideLoading();
          NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
        },
        onFail: (err: any) => {
          NavigationActionsService.hideLoading();
          alertError(err);
        },
      }),
    );
  };

  const onChange = text => {
    if (isError) {
      setIsError(false);
    }
    textInput = text.values.name.trim();
  };

  const validateCard = () => {
    if (!textInput || !validateEmail(textInput)) {
      if (!isError) {
        setIsError(true);
      }
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('addPaypal')} />
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.wrapCard}>
          <CreditCardInput
            isFromPaypal={true}
            requiresName
            cardFontFamily={fonts.family.PlayBold}
            bgPaypal={images.bgPaypal}
            iconPaypal={images.payPals}
            cardImageFront={images.bgCard}
            labelStyle={styles.wrapLabel}
            inputStyle={styles.wrapInput}
            labels={{ name: language('enterYourEmail') }}
            placeholders={{ name: 'Email@gmail.com' }}
            values={{ number: '5454545454545454', expiry: '12/23', cvc: '123', name: email, type: 'visa' }}
            onChange={onChange}
          />
          <ErrorMessage style={styles.wrapError} errorValue={isError ? alertMessage.ERROR_EMAIL_VALIDATE : ''} />
        </ScrollView>
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
    borderColor: colors.gray_400,
    paddingHorizontal: 10,
  },
  wrapError: {
    marginTop: 5,
  },
  wrapCard: {
    flex: 1,
    marginTop: 30,
  },
  btnContinue: {
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginTop: 10,
    marginBottom: isIphoneX() ? 40 : 30,
    width: null,
    marginHorizontal: 15,
    borderRadius: 36,
  },
});
