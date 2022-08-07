import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import { CreditCardInput } from 'react-native-credit-card-input';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { isIOS, isIphoneX } from '@/shared/devices';
import ErrorMessage from '@/components/ErrorMessage';
import { useAlertMessage } from '@/constants/messageConstants';
import { useRoute } from '@react-navigation/native';
import NavigationActionsService from '@/navigation/navigation';
import { updateCard } from '@/redux/payment/actions';
import { alertError } from '@/shared/alert';
import { PAYMENT_ACCOUNTS_SCREEN } from '@/navigation/screenKeys';
import IconBack from '@/components/SVG/BackSvg';

let cardInfo = null;

export function PaymentUpdateCardScreen(): ReactElement {
  const [isError, setIsError] = useState(false);
  const { cardId, cardholderName, expiry, last4 } = useRoute().params as any;
  const alertMessage = useAlertMessage();

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

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (validateCard()) {
      return;
    }
    setIsError(false);
    NavigationActionsService.showLoading();

    const { name, expiry } = cardInfo.values;
    const expiryDate = expiry.split('/');

    NavigationActionsService.dispatchAction(
      updateCard({
        id: cardId,
        cardholderName: name,
        expirationYear: expiryDate[1],
        expirationMonth: expiryDate[0],
        onSuccess,
        onFail: onFail,
      }),
    );
  };

  const onSuccess = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.push(PAYMENT_ACCOUNTS_SCREEN);
  };

  const onFail = err => {
    NavigationActionsService.hideLoading();
    alertError(err);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('updateCard')} />
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.wrapCard}>
          <CreditCardInput
            requiresName
            isFromUpdateCard
            autoFocus
            requiresCVC={false}
            cardImageFront={images.bgCard}
            cardFontFamily={fonts.family.PlayBold}
            labelStyle={styles.wrapLabel}
            inputStyle={styles.wrapInput}
            placeholders={{
              number: `**** **** **** ${last4}`,
            }}
            values={{
              number: '4242 4242 4242 4242',
              expiry: expiry,
              name: cardholderName,
            }}
            labels={{
              name: language('cardInput.name'),
              number: language('cardInput.number'),
              expiry: language('cardInput.expiry'),
              cvc: language('cardInput.cvc'),
              postalCode: language('cardInput.postalCode'),
            }}
            cardholderLabel={language('cardHolderName')}
            expireLabel={language('expire')}
            onChange={onChange}
          />
          <ErrorMessage style={styles.wrapError} errorValue={isError ? alertMessage.ERROR_MESSAGE_FORMAT : ''} />
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
