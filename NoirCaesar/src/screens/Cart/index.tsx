import React, { useEffect } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import styles from './styles';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomHeader } from '@src/components/CustomHeader';
import BACK from '@res/images/back.png';
import translate from '@src/localize';
import CartItem from '@src/components/FlatListItem/CartItem';
import { CustomButton } from '@src/components/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { getListCart, updateCartQuantity, removeCartItem, deleteCart } from '@src/modules/cart/actions';
import { SHIPPING_DETAILS } from '@src/constants/screenKeys';
import { IBasket, IBasketLine } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { ICON_TRASH } from '@src/constants/icons';
import { formatPrice } from '@src/utils';
import EmptyData from '@src/components/EmptyData';
import Container from '@src/components/Container';

enum UpdateType {
  PLUS,
  MINUS,
  DELETE_ITEM,
  DELETE_CART,
}

const Cart = () => {
  const listCart = useSelector<RootState, IBasket>((state: RootState) => state.cart.listCart);
  const { total_excl_tax } = listCart;
  const dispatch = useDispatch();
  const isCartEmpty = !listCart || !listCart.lines || listCart.lines.length == 0;

  const showAlertError = (error: any) => {
    NavigationActionsService.showErrorPopup(error);
  };

  useEffect(() => {
    NavigationActionsService.showLoading();
    loadListCart();
  }, []);

  const loadListCart = () => {
    dispatch(
      getListCart({
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          showAlertError(error);
        },
      }),
    );
  };

  const handleBack = () => {
    NavigationActionsService.popToRoot();
  };

  const showAlert = (title: string, message: string, deleteCallBack: () => void) => {
    NavigationActionsService.showCustomPopup({
      text: message,
      buttonRedTitle: translate('alert.ok'),
      buttonGrayTitle: translate('alert.cancel'),
      onPressRedButton: () => {
        NavigationActionsService.hideCustomPopup();
        deleteCallBack();
      },
    });
  };

  const handleEvent = (type: UpdateType, item?: IBasketLine) => {
    switch (type) {
      case UpdateType.PLUS:
      case UpdateType.MINUS:
        item && handleUpdateQuantity(type, item);
        break;
      case UpdateType.DELETE_ITEM:
        item && handleRemoveCartItem(item);
        break;
      case UpdateType.DELETE_CART:
        handleRemoveCart();
        break;
    }
  };

  const handleRemoveCart = () => {
    if (isCartEmpty) {
      NavigationActionsService.showCustomPopup({
        text: translate('cart.alert_empty'),
      });
      return;
    }

    showAlert(translate('cart.delete_cart'), translate('cart.confirm_delete_cart'), () => {
      NavigationActionsService.showLoading();
      dispatch(
        deleteCart({
          basket_id: listCart.id,
          onSuccess: loadListCart,
          onFail: error => {
            NavigationActionsService.hideLoading();
            showAlertError(error);
          },
        }),
      );
    });
  };

  const handleRemoveCartItem = (item: IBasketLine) => {
    NavigationActionsService.showLoading();
    dispatch(
      removeCartItem({
        line_url: item.url,
        onSuccess: loadListCart,
        onFail: error => {
          NavigationActionsService.hideLoading();
          showAlertError(error);
        },
      }),
    );
  };

  const handleUpdateQuantity = (type: UpdateType, item: IBasketLine) => {
    NavigationActionsService.showLoading();
    dispatch(
      updateCartQuantity({
        line_url: item.url,
        quantity: type == UpdateType.PLUS ? item.quantity + 1 : item.quantity - 1,
        onSuccess: loadListCart,
        onFail: error => {
          NavigationActionsService.hideLoading();
          showAlertError(error);
        },
      }),
    );
  };

  const handlePlusPress = (item: IBasketLine) => {
    handleEvent(UpdateType.PLUS, item);
  };

  const handleMinusPress = (item: IBasketLine) => {
    if (item.quantity <= 1) {
      showAlert(translate('cart.delete_item'), translate('cart.confirm_delete'), () => {
        handleEvent(UpdateType.DELETE_ITEM, item);
      });
    } else {
      handleEvent(UpdateType.MINUS, item);
    }
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.customHeader}
        leftImage={BACK}
        leftImageStyle={styles.backButton}
        leftAction={handleBack}
        rightImage={ICON_TRASH}
        rightImageStyle={styles.trashButton}
        rightAction={handleEvent.bind(undefined, UpdateType.DELETE_CART)}
        title={translate('cart.title')}
      />
    );
  };

  const renderCartItem = ({ item, index }: { item: IBasketLine; index: number }) => {
    return (
      <CartItem
        containerStyle={{ paddingBottom: 10 }}
        item={item}
        onPlusPress={handlePlusPress.bind(undefined, item)}
        onMinusPress={handleMinusPress.bind(undefined, item)}
      />
    );
  };

  const renderListCart = () => (
    <FlatList
      style={{ flex: 1 }}
      keyExtractor={index => index.toString()}
      data={listCart.lines}
      renderItem={renderCartItem}
      ListEmptyComponent={<EmptyData />}
    />
  );

  const onButtonPress = () => {
    NavigationActionsService.push(SHIPPING_DETAILS, {}, true);
  };

  const renderBottomButton = () => {
    if (isCartEmpty) return null;

    return (
      <SafeAreaView>
        <CustomButton
          style={styles.bottomButton}
          textStyle={styles.bottomLeftText}
          text={`Subtotal: ${formatPrice(total_excl_tax)}`}
          secondText={'Checkout'}
          secondTextStyle={styles.bottomRightText}
          onPress={onButtonPress}
        />
      </SafeAreaView>
    );
  };

  return (
    <Container>
      {renderHeader()}
      {renderListCart()}
      {renderBottomButton()}
    </Container>
  );
};

export default Cart;
