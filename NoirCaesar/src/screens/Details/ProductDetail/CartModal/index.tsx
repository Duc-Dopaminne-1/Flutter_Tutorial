import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import styles from './styles';
import translate from '@src/localize';
import Modal from 'react-native-modal';
import CartItem from '@src/components/FlatListItem/CartItem';
import { CustomButton } from '@src/components/CustomButton';
import { useDispatch } from 'react-redux';
import { addToCart } from '@src/modules/cart/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { SHIPPING_DETAILS } from '@src/constants/screenKeys';
import { IBasketLine } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';

export enum ModalType {
  UNKNOWN,
  ADD_TO_CART,
  BUY_NOW,
}

export interface ModalObject {
  item: IBasketLine;
  modalType?: ModalType;
  isVisible?: boolean;
}

interface Props {
  modalObject: ModalObject;
  onHideModal?: () => void;
  onAddCartSuccess?: () => void;
}

const CartModal = (props: Props) => {
  const { modalObject, onHideModal, onAddCartSuccess } = props;
  const { item, modalType, isVisible } = modalObject;
  const [cartItem, setCartItem] = useState(item);

  const dispatch = useDispatch();

  const handlePlusPress = () => {
    const newCartItem = {
      ...cartItem,
      quantity: cartItem.quantity + 1,
    };
    setCartItem(newCartItem);
  };

  const handleMinusPress = () => {
    if (cartItem.quantity > 1) {
      const newCartItem = {
        ...cartItem,
        quantity: cartItem.quantity - 1,
      };
      setCartItem(newCartItem);
    }
  };

  const handleAddToCart = (successCallBack: () => void) => {
    dispatch(
      addToCart({
        product_url: item.product.url,
        quantity: cartItem.quantity,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          onHideModal && onHideModal();
          successCallBack();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        },
      }),
    );
  };

  const handleButtonPress = () => {
    NavigationActionsService.showLoading();
    switch (modalType) {
      case ModalType.ADD_TO_CART:
        handleAddToCart(() => {
          onAddCartSuccess && onAddCartSuccess();
        });
        break;
      case ModalType.BUY_NOW:
        handleAddToCart(() => {
          NavigationActionsService.push(SHIPPING_DETAILS, {}, true);
        });
        break;
      case ModalType.UNKNOWN:
        break;
    }
  };

  const renderBottomButton = () => {
    if (modalType == ModalType.UNKNOWN) return null;

    const buttonText = modalType == ModalType.ADD_TO_CART ? translate('product.add_to_cart') : translate('product.buy_now');
    return (
      <CustomButton
        activeOpacity={0.8}
        style={styles.bottomButton}
        textStyle={styles.bottomButtonText}
        text={buttonText}
        onPress={handleButtonPress}
      />
    );
  };

  return (
    <Modal onBackdropPress={onHideModal} onBackButtonPress={onHideModal} style={styles.container} isVisible={isVisible}>
      <SafeAreaView>
        <CartItem
          containerStyle={{ backgroundColor: '#191921' }}
          item={cartItem}
          onPlusPress={handlePlusPress}
          onMinusPress={handleMinusPress}
        />
        {renderBottomButton()}
      </SafeAreaView>
    </Modal>
  );
};

export default CartModal;
