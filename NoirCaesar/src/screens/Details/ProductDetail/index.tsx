import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import styles from './styles';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomHeader } from '@src/components/CustomHeader';
import BlurImage from './BlurImage';
import ProductInfo from './ProductInfo';
import BottomButton from './BottomButton';
import BACK from '@res/images/back.png';
import translate from '@src/localize';
import CartModal, { ModalType, ModalObject } from './CartModal';
import { CustomPopup } from '@src/components/CustomPopup';
import { CART_SCREEN } from '@src/constants/screenKeys';
import { RootState } from '@src/types/types';
import { IProduct } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import Container from '@src/components/Container';

const ProductDetail = () => {
  const productDetail = useSelector<RootState, IProduct>((state: RootState) => state.cart.product_detail);
  const { title, description, images, availability, price, url, stockrecords, book } = productDetail;
  const [modalObject, setModalObject] = useState<ModalObject>();
  const [showCustomPopup, setShowPopup] = useState(false);

  const handleBack = () => {
    NavigationActionsService.pop();
  };

  const handlePressAddToCard = () => {
    if (!availability.is_available_to_buy) {
      NavigationActionsService.showCustomPopup({
        text: translate('cart.error_out_of_stock'),
      });
      return;
    }

    setModalObject({
      item: {
        product: cloneDeep(productDetail),
        price_excl_tax: price.excl_tax,
        quantity: 1,
      },
      isVisible: true,
      modalType: ModalType.ADD_TO_CART,
    });
  };

  const handlePressBuyNow = () => {
    if (!availability.is_available_to_buy) {
      NavigationActionsService.showCustomPopup({
        text: translate('cart.error_out_of_stock'),
      });
      return;
    }

    setModalObject({
      item: {
        product: cloneDeep(productDetail),
        price_excl_tax: price.excl_tax,
        quantity: 1,
      },
      isVisible: true,
      modalType: ModalType.BUY_NOW,
    });
  };

  const handleHideModal = () => {
    setModalObject({
      item: {},
      isVisible: false,
      modalType: ModalType.UNKNOWN,
    });
  };

  const handleAddCartSuccess = () => {
    doShowCustomPopup();
  };

  const doShowCustomPopup = () => {
    setShowPopup(true);
  };

  const hideCustomPopup = () => {
    setShowPopup(false);
  };

  const handleGoToCart = () => {
    hideCustomPopup();
    NavigationActionsService.push(CART_SCREEN, {}, true);
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.customHeader}
        leftImage={BACK}
        leftAction={handleBack}
        title={translate('product.product_details')}
      />
    );
  };

  const renderImageView = () => {
    const img = images[0];

    return <BlurImage imageSource={{ uri: img && img.original }} />;
  };

  const renderInfo = () => {
    const stock = stockrecords && stockrecords[0];
    const priceShow = availability.is_available_to_buy ? price && price.excl_tax : undefined;

    return (
      <ProductInfo
        title={title}
        code={stock && stock.partner_sku}
        price={priceShow}
        description={description}
        creators={book && book.creator}
        artists={book && book.artist}
        writers={book && book.writer}
      />
    );
  };

  const renderBottomButton = () => {
    return <BottomButton onAddToCard={handlePressAddToCard} onBuyNow={handlePressBuyNow} />;
  };

  const renderModal = () => {
    return (
      modalObject &&
      modalObject.isVisible && <CartModal modalObject={modalObject} onHideModal={handleHideModal} onAddCartSuccess={handleAddCartSuccess} />
    );
  };

  const renderPopUp = () => {
    if (!showCustomPopup) return null;

    return (
      <CustomPopup
        loading={showCustomPopup}
        text={translate('cart.add_cart_success')}
        buttonRedTitle={translate('cart.go_to_cart')}
        buttonGrayTitle={translate('cart.close')}
        showLogo={true}
        onBackdropPress={hideCustomPopup}
        onPressRedButton={handleGoToCart}
        onPressGrayButton={hideCustomPopup}
      />
    );
  };

  return (
    <Container>
      {renderHeader()}
      <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
        {renderImageView()}
        {renderInfo()}
      </ScrollView>
      {renderBottomButton()}
      {renderModal()}
      {renderPopUp()}
    </Container>
  );
};

export default ProductDetail;
