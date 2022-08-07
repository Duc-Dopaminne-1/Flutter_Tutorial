import React, { ReactElement, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import { GlobalProps } from '@/shared/Interface';
import ActionSheet from 'react-native-actionsheet';
import { useDispatch } from 'react-redux';
import { deleteCard } from '@/redux/payment/actions';
import { useNavigation } from '@react-navigation/native';
import { alertError, alertVerify } from '@/shared/alert';
import { formatNameDetailPayment } from '@/shared/processing';
import { RulePayment } from '@/constants/app';
import { CreditCardInput } from 'react-native-credit-card-input';
import { PAYMENT_UPDATE_CARD_SCREEN, PAYMENT_UPDATE_PAYPAL_SCREEN } from '@/navigation/screenKeys';
import CustomConfirmModal from '@/components/CustomModal';
import NavigationActionsService from '@/navigation/navigation';
import { isIOS } from '@/shared/devices';
import EditDotSVG from '@/components/SVG/EditDotSVG';
import IconBack from '@/components/SVG/BackSvg';

export function PaymentCardDetailScreen(props: GlobalProps): ReactElement {
  const card = props.route.params ? props.route.params?.card : { id: 0, cardholderName: '', cardType: '', last4: '', expirationDate: '' };
  const isFromCardDefault = props.route.params ? props.route.params?.isFromCardDefault : false;
  const { id, cardType, last4, expirationMonth, expirationYear, type, cardholderName } = card;
  const [modalVisible, setModalVisible] = useState(false);
  const options = [language('update'), language('removeCard'), language('cancel')];
  const optionsDefault = [options[0], options[2]];
  const actionRef: any = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleActionSheet = index => {
    if (isFromCardDefault) {
      if (index === 0) {
        onUpdateCard();
        return;
      }
      return;
    }
    switch (index) {
      case 0:
        if (type === RulePayment.PayPal) {
          onUpdatePaypal();
          break;
        }
        onUpdateCard();
        break;
      case 1:
        if (type === RulePayment.PayPal) {
          alertVerify('', language('alert.areYouWantToDelete'), language('confirm'), onConfirmPress);
          break;
        }
        setModalVisible(true);
        break;
      default:
        break;
    }
  };

  const onUpdateCard = () => {
    navigation.navigate(PAYMENT_UPDATE_CARD_SCREEN, {
      cardId: id,
      cardholderName: cardholderName,
      expiry,
      last4: last4,
    });
  };

  const onUpdatePaypal = () => {
    navigation.navigate(PAYMENT_UPDATE_PAYPAL_SCREEN, {
      email: formatNameDetailPayment(card),
      id,
    });
  };

  const onConfirmPress = () => {
    onBackdropPress();
    NavigationActionsService.showLoading();
    setTimeout(() => {
      dispatch(
        deleteCard({
          id,
          onSuccess: onDeleteSuccess,
          onFail: onDeleteFail,
        }),
      );
    }, 400);
  };

  const onDeleteSuccess = () => {
    NavigationActionsService.hideLoading();
    navigation.goBack();
  };

  const onDeleteFail = (err: string) => {
    NavigationActionsService.hideLoading();
    if (err === 'error.CANT_REMOVE_DEFAULT_PAYMENT') {
      alertError(language(type === RulePayment.PayPal ? 'canNotDeletePaypal' : 'canNotDelete'));
      return;
    }
    alertError(err);
  };

  const onPress = () => {
    actionRef.current.show();
  };

  const renderActionSheet = () => {
    if (isFromCardDefault) {
      return <ActionSheet ref={actionRef} options={optionsDefault} cancelButtonIndex={1} onPress={handleActionSheet} />;
    } else {
      return <ActionSheet ref={actionRef} options={options} destructiveButtonIndex={1} cancelButtonIndex={2} onPress={handleActionSheet} />;
    }
  };

  const expiry = useMemo(() => {
    if (type === RulePayment.PayPal) return null;
    let month = '';
    if (parseInt(expirationMonth) < 10) {
      month = '0' + expirationMonth;
    } else {
      month = expirationMonth;
    }
    return month + '/' + expirationYear[expirationYear.length - 2] + expirationYear[expirationYear.length - 1];
  }, [expirationMonth, expirationYear]);

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader
        leftIcon={<IconBack />}
        rightIcon={<EditDotSVG />}
        wrapIconStyle={styles.wrapIcon}
        onPressSubIcon={onPress}
        title={language('details')}
        titleStyle={styles.textTitle}
      />

      <View style={styles.wrapCard}>
        {type === RulePayment.PayPal ? (
          <CreditCardInput
            isFromPaypalDetail={true}
            requiresName
            cardFontFamily={fonts.family.PlayBold}
            bgPaypal={images.bgPaypal}
            iconPaypal={images.payPals}
            cardImageFront={images.bgPaypal}
            values={{
              name: formatNameDetailPayment(card),
            }}
            cardholderLabel={language('cardHolderName')}
            expireLabel={language('expire')}
          />
        ) : (
          <CreditCardInput
            isFromCardDetail={true}
            requiresName
            cardImageFront={images.bgCard}
            values={{
              number: `**** **** **** ${last4}`,
              expiry,
              cvc: '***',
              name: formatNameDetailPayment(card),
              type: cardType ? cardType.toLowerCase() : '',
            }}
            cardholderLabel={language('cardHolderName')}
            expireLabel={language('expire')}
          />
        )}
      </View>
      {renderActionSheet()}
      <CustomConfirmModal
        isVisible={modalVisible}
        title={language('deleteCard') + `${last4} ?`}
        textBtnConfirm={language('cancelMeetScreen.confirm')}
        onBackdropPress={onBackdropPress}
        onConfirmPress={onConfirmPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  },
  wrapCard: {
    marginTop: 30,
  },
  wrapIcon: {
    marginHorizontal: 15,
  },
});
