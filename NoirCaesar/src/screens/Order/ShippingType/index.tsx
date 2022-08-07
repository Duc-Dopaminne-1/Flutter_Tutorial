import { View, FlatList, Alert } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { ShippingTypeItem } from '@src/components/ShippingTypeItem';
import { CustomButton } from '@src/components/CustomButton';
import { PAYMENT_DETAILS } from '@src/constants/screenKeys';
import { OrderPopup } from '@src/components/Popup/OrderPopup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IAddress, IShippingMethod } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { getShippingMethodList, saveShippingMethod } from '@src/modules/payment/actions';

const ShippingType = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState<number>(0);
  const popupRef: any = useRef(null);
  const shippingAddress = useSelector<RootState, IAddress>((state: RootState) => state.payment.shippingAddress);
  const shippingMethod = useSelector<RootState, IShippingMethod[]>((state: RootState) => state.payment.shippingMethodList);

  useEffect(() => {
    NavigationActionsService.showLoading();
    dispatch(
      getShippingMethodList({
        data: shippingAddress,
        onSuccess: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
      }),
    );
  }, []);

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
    shippingMethod.length > 0 && NavigationActionsService.push(PAYMENT_DETAILS, {}, true);
  };

  const onPressItem = (index: number) => {
    setActive(index);
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        leftImage={BACK}
        leftAction={onBack}
        title={translate('order.shipping_details')}
        rightComponent={renderRightHeader()}
        rightAction={onCancel}
      />
    );
  };

  const renderItem = ({ index, item }: { index: number; item: IShippingMethod }) => {
    active === index && dispatch(saveShippingMethod({ shippingMethod: item }));
    return <ShippingTypeItem item={item} isActive={active === index} onPressItem={onPressItem.bind(undefined, index)} />;
  };

  const renderRightHeader = () => {
    return <CustomText style={{ fontSize: 12, color: '#676877' }} text={translate('order.cancel')} />;
  };

  return (
    <Container>
      <OrderPopup ref={popupRef} onPressGrayButton={onPressGrayButton} />
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          style={styles.scrollview}
          data={shippingMethod}
          renderItem={renderItem}
          extraData={active}
          keyExtractor={(_, index) => index.toString()}
        />
        <CustomButton
          disabled={shippingMethod.length == 0}
          onPress={onButtonPress}
          style={styles.button}
          text={translate('order.continue')}
        />
      </View>
    </Container>
  );
};

export default ShippingType;
