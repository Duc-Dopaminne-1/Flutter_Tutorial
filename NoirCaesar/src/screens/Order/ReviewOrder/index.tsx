import { View, FlatList, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CartItem from '@src/components/FlatListItem/CartItem';
import CustomInput from '@src/components/CustomInput';
import { CustomPopup } from '@src/components/CustomPopup';
import { OrderPopup } from '@src/components/Popup/OrderPopup';
import { ProviderEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IBasket, IBasketLine, IOrder } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { formatPrice } from '@src/utils';
import { addPromoCode, checkOut } from '@src/modules/payment/actions';
import { colors } from '@src/constants/vars';
import { getListCart, removeCartItem } from '@src/modules/cart/actions';
import { IPaymentState } from '@src/modules/payment';
import { paymentOrder } from '@src/utils/payment';
import { IError } from '@src/modules/base';

interface Props {
  provider: ProviderEnum;
}

const ReviewOrder = (props: Props) => {
  const dispatch = useDispatch();

  const [promoCode, setPromoCode] = useState<string>('');
  const [isShowPopup, setShowPopup] = useState<boolean>(false);
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(true);

  const popupRef: any = useRef(null);
  const totalPrice: any = useRef(null);

  const listCart = useSelector<RootState, IBasket>((state: RootState) => state.cart.listCart);
  const payment = useSelector<RootState, IPaymentState>((state: RootState) => state.payment);
  const userEmail = useSelector<RootState, string | undefined>((state: RootState) => state.auth.userData?.email);

  useEffect(() => {
    listCart.lines.length == 0 && NavigationActionsService.popToRoot();
  }, [listCart.lines]);

  const roundNumber = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  };

  const sumTotalPrice = () => {
    let totalPrice = 0;
    if (listCart.lines && listCart.lines.length > 0) {
      listCart.lines.forEach(item => {
        totalPrice += item.price_excl_tax;
      });
      totalPrice = roundNumber(totalPrice);
    }

    return totalPrice;
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const onCancel = () => {
    popupRef.current && popupRef.current.showPopup();
  };

  const onPressGrayButton = () => {
    NavigationActionsService.popToRoot();
  };

  const onButtonPress = () => {
    Keyboard.dismiss();
    NavigationActionsService.showLoading();
    dispatch(
      checkOut({
        data: {
          basket: listCart.url,
          shipping_address: payment.shippingAddress,
          billing_address: payment.billingAddress,
          shipping_method_code: payment.shippingMethod?.code ?? '',
          provider: props.provider,
          guest_email: userEmail,
          total: totalPrice.current,
        },
        onSuccess: (value: IOrder) => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            paymentOrder(
              value.payment_url,
              props.provider,
              () => {
                setShowPopup(true);
              },
              (error: IError) => {
                NavigationActionsService.showCustomPopup({
                  text: error.message,
                  buttonRedTitle: "Close",
                  onPressRedButton: () => {
                    NavigationActionsService.hideCustomPopup();
                    NavigationActionsService.popToRoot();
                  }
                })
              }
            );
          }, 500);
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onPressActivePopUp = () => {
    setShowPopup(false);
    NavigationActionsService.popToRoot();
  };

  const onPressDeleteItem = (itemUrl: string) => {
    NavigationActionsService.showCustomPopup({
      text: translate('cart.confirm_delete'),
      buttonRedTitle: translate('alert.ok'),
      buttonGrayTitle: translate('alert.cancel'),
      onPressRedButton: () => {
        NavigationActionsService.hideCustomPopup();
        removeItem(itemUrl);
      },
    });
  };

  const removeItem = (itemUrl: string) => {
    NavigationActionsService.showLoading();
    dispatch(
      removeCartItem({
        line_url: itemUrl,
        onSuccess: reloadCart,
        onFail: error => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        },
      }),
    );
  };

  const reloadCart = () => {
    dispatch(
      getListCart({
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        },
      }),
    );
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        leftImage={BACK}
        leftAction={onBack}
        title={translate('order.review_order')}
        rightComponent={renderRightHeader()}
        rightAction={onCancel}
      />
    );
  };

  const renderRightHeader = () => {
    return <CustomText style={{ fontSize: 12, color: '#676877' }} text={translate('order.cancel')} />;
  };

  const renderButton = () => {
    return <CustomButton onPress={onButtonPress} style={styles.button} text={translate('order.place_order')} />;
  };

  const renderCartItem = ({ item }: { item: IBasketLine }) => {
    return (
      <CartItem
        containerStyle={styles.cartItem}
        item={item}
        isEditable={false}
        onDeleteItem={onPressDeleteItem.bind(undefined, item.url)}
      />
    );
  };

  const renderListCart = () => {
    return (
      <FlatList
        style={{ flex: 1 }}
        scrollEnabled={false}
        keyExtractor={index => index.toString()}
        data={listCart.lines}
        renderItem={renderCartItem}
      />
    );
  };

  const onSubmitPromoCode = () => {
    if (showSubmitButton) {
      Keyboard.dismiss();
      dispatch(
        addPromoCode({
          promoCode: promoCode,
          onSuccess: () => {
            NavigationActionsService.showLoading();
            dispatch(
              getListCart({
                onSuccess: () => {
                  setTimeout(() => {
                    setShowSubmitButton(false);
                    NavigationActionsService.hideLoading();
                  }, 500);
                },
                onFail: error => {
                  setTimeout(() => {
                    NavigationActionsService.hideLoading();
                    NavigationActionsService.showErrorPopup(error);
                  }, 500);
                },
              }),
            );
          },
          onFail: error => {
            NavigationActionsService.showErrorPopup(error);
          },
        }),
      );
    } else {
      setPromoCode('');
      setShowSubmitButton(true);
    }
  };

  const renderPromoCode = () => {
    return (
      <View>
        <CustomInput
          onChangeText={(text: string) => setPromoCode(text)}
          placeholder={translate('order.promo_code')}
          pointerEvents={showSubmitButton ? 'auto' : 'none'}
          editable={showSubmitButton}
          value={promoCode}
          returnKeyType="next"
          autoCapitalize="characters"
        />
        <CustomTouchable disabled={promoCode.trim() == ''} style={styles.submitTouchable} onPress={onSubmitPromoCode}>
          <View style={[styles.submitContainer, { backgroundColor: promoCode.trim() == '' ? colors.GRAY_COLOR : colors.RED_COLOR }]}>
            <CustomText style={styles.submitStyle} text={showSubmitButton ? translate('common.submit') : translate('common.cancel')} />
          </View>
        </CustomTouchable>
      </View>
    );
  };

  const renderPriceItem = (text: string, price: string, total: boolean = false) => {
    return (
      <View style={styles.priceItemContainer}>
        <CustomText style={total ? styles.totalText : styles.priceText} text={text} />
        <CustomText style={total ? styles.totalText : styles.priceText} text={price} />
      </View>
    );
  };

  const renderPrice = () => {
    const sumPriceItem = sumTotalPrice();
    const shippingFee = payment.shippingMethod?.price.excl_tax ?? 0;
    const tax = payment.shippingMethod?.price.tax ?? 0;

    totalPrice.current = roundNumber(sumPriceItem + shippingFee + tax);

    return (
      <View style={{ paddingBottom: 40 }}>
        {renderPriceItem(translate('order.subtotal'), `${formatPrice(sumPriceItem)}`)}
        {renderPriceItem(translate('order.shipping'), `${formatPrice(shippingFee)}`)}
        {renderPriceItem(translate('order.sales_tax'), `${formatPrice(tax)}`)}
        {renderPriceItem(translate('order.total'), `${formatPrice(totalPrice.current)}`, true)}
      </View>
    );
  };

  return (
    <Container>
      <OrderPopup ref={popupRef} onPressGrayButton={onPressGrayButton} />
      <CustomPopup text={translate('order.order_success')} loading={isShowPopup} onPressRedButton={onPressActivePopUp} />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
          {renderListCart()}
          {renderPromoCode()}
          {renderPrice()}
        </KeyboardAwareScrollView>
        {renderButton()}
      </View>
    </Container>
  );
};

export default ReviewOrder;
