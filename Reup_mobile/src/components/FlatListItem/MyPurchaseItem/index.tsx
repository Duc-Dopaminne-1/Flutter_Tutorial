import React from 'react';
import { styles } from './styles';
import { View, Image } from 'react-native';
import CircleAvatar from '@src/components/CircleAvatar';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CLOSE_ICON_X, ICON_CONTACT_MANAGER } from '@src/constants/icons';
import translate from '@src/localize';
import { CustomButton } from '@src/components/CustomButton';
import { CustomText } from '@src/components/CustomText';
import { Theme } from '@src/components/Theme';
import { CustomFlatList } from '@src/components/FlatList';
import { formatCurrency } from '@src/utils';
import MyPurchaseProductItem from '../MyPurchaseProductItem';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';

export interface IMyPurchaseItem {
  seller: {
    avatar: string;
    name: string;
    aparment_code: string;
  }
  products: IProductGetResponse[];
  total_price: number;
}

type Props = {
  item: IMyPurchaseItem;
  onPressContactManager: () => void;
  onPressProductDetail: (item: IProductGetResponse) => void;
}

const MyPurchaseItem = (props: Props) => {

  const { item, onPressContactManager, onPressProductDetail } = props;

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => { };

  const onPressProduct = (item: IProductGetResponse) => {
    onPressProductDetail(item);
  };

  const renderCloseButton = () => (
    <View style={{ alignItems: 'flex-end' }}>
      <CustomTouchable style={styles.closeButton}>
        <Image source={CLOSE_ICON_X} style={styles.closeImage} resizeMode='contain' />
      </CustomTouchable>
    </View>
  );

  const renderSellerContent = () => {
    return (
      <View style={styles.sellerContent}>
        <CircleAvatar name={''} avatar={item && item.seller.avatar} />
        <View style={{ marginLeft: 18, alignItems: 'flex-start' }}>
          <View style={styles.infoSeller}>
            <CustomText
              text={item && item.seller.name}
              style={styles.nameText}
              styleContainer={styles.nameContainer}
            />
            <CustomText
              text={item && item.seller.aparment_code}
              style={styles.apartmentCodeText}
              styleContainer={styles.apartmentCodeContainer}
            />
          </View>
          <View >
            <CustomButton
              style={styles.contactButton}
              text={translate('my_purchase.contact_seller')}
              textStyle={styles.contactText}
              iconLeft={ICON_CONTACT_MANAGER}
              iconRightStyle={styles.iconContact}
              onPress={onPressContactManager}
            />
          </View>
        </View>
      </View >
    );
  };

  const renderSeparator = () => {
    return (
      <View style={[styles.separator, { backgroundColor: Theme.my_purchase_tenant.separatorSeller, }]} />
    );
  };

  const renderItem = (item: IProductGetResponse) => (
    <MyPurchaseProductItem item={item} onPress={onPressProduct} />
  );

  const renderProductContent = () => (
    <View style={styles.listContainer}>
      <CustomFlatList
        onLoad={onLoad}
        ItemSeparatorComponent={renderSeparator}
        data={item.products}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );

  const renderTotal = () => (
    <View style={styles.totalView}>
      <CustomText text={translate('my_purchase.total')} style={styles.totalText} />
      <CustomText text={formatCurrency(item.total_price, 'USD')} style={styles.priceText} />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCloseButton()}
      <View style={{ paddingHorizontal: 13 }}>
        {renderSellerContent()}
        {renderSeparator()}
        {renderProductContent()}
        <View style={[styles.separator, { backgroundColor: Theme.my_purchase_tenant.separtorProduct, }]} />
        {renderTotal()}
      </View>
    </View>
  );
};

export default MyPurchaseItem;