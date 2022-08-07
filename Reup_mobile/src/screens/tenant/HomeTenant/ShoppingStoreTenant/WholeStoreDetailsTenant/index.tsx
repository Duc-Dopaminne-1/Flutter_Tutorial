import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Linking, Platform } from 'react-native';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import AboutSeller, { SellerModel } from '@src/components/AboutSeller';
import { useRoute } from '@react-navigation/native';
import { ProductItemModal } from '@src/components/ProductList';
import { CustomText } from '@src/components/CustomText';
import ShowingImages from '@src/components/ShowingImages';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { formatCurrency } from '@src/utils';
import { IC_SHOPPING_STORE } from '@src/constants/icons';
import { CustomFlatList } from '@src/components/FlatList';
import ProductItemGrid from '@src/components/ProductItemGrid';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { QueryShoppingProductParams } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/product';
import { LimitLoadMore } from '@src/constants/vars';
import { getListShoppingProduct } from '@src/modules/shopping_store/action';
import ShoppingStoreItem, { ShoppingStoreItemModal, ShoppingStoreType } from '@src/components/FlatListItem/ShoppingStoreItem';
import { formatApiToUI } from '@src/utils/date';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import NavigationActionsService from '@src/navigation/navigation';
import { WHOLE_STORE_DETAILS_TENANT } from '@src/constants/screenKeys';

interface Props {
  data: ShoppingStoreItemModal;
}

const WholeStoreDetailsTenant = () => {
  const route = useRoute();
  const { data } = route.params as Props;
  const product = data.product;
  const owner = product.owner;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const dispatch = useDispatch();
  const [relativeData, setRelativeData] = useState<ShoppingStoreItemModal[]>([]);
  const [isLoadedData, setLoadedData] = useState<boolean>(false);
  const relativeList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listRelativeProduct);
  const [selectedIndex, setSelecteIndex] = useState<number>(0);

  useEffect(() => {
    if (isLoadedData) {
      setSelecteIndex(0);
      fetchRelativeProduct(1);
    }
  }, [data]);

  useEffect(() => {
    const listRelativeProduct: ShoppingStoreItemModal[] = [];
    relativeList.results.forEach((item: IProductGetResponse) => {
      const relativeItem: ShoppingStoreItemModal = {
        product: item,
        type: ShoppingStoreType.WHOLE_STORE,
        isSelected: false
      };

      if (item.id !== product.id) {
        listRelativeProduct.push(relativeItem);
      }
    });
    setRelativeData(listRelativeProduct);
  }, [relativeList]);


  const fetchRelativeProduct = (page: number, onLoadSuccess?: any, onLoadFailure?: any) => {
    const params: QueryShoppingProductParams = {
      category_id: product.category.id,
    };
    NavigationActionsService.showLoading();
    dispatch(getListShoppingProduct({
      id: me.default_property,
      page: page,
      limit: LimitLoadMore,
      params,
      isSave: true,
      isRelative: true,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        console.log("===== get store success:", data);
        setLoadedData(true);
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        console.log("===== get store fail:", error);
        setLoadedData(true);
      }
    }));
  };
  const onSelectImage = (index: number) => {
    setSelecteIndex(index);
  };
  const renderProductContent = () => {
    const name = product.name ? product.name : "";
    const date = product.created ? translate("shopping_store.post_on") + formatApiToUI(product.created) : "";
    const imageList = product.image_urls ? product.image_urls : [];
    const category = product.category ? product.category.name : "";
    const price = product.price ? `${formatCurrency(product.price, product.currency)}` : "";
    const description = product.description ? product.description : "";

    return (
      <View>
        <View style={styles.content}>
          <CustomText numberOfLines={2} text={name} style={styles.titleText} styleContainer={styles.titleContainer} />
          <CustomText numberOfLines={1} text={date} style={styles.dateText} styleContainer={styles.dateContainer} />
        </View>
        <ShowingImages
          selectedIndex={selectedIndex}
          onSelectImage={onSelectImage}
          imageList={imageList}
          style={styles.showImageContainer}
        />
        <View style={styles.content}>
          <View style={styles.categoryContainer}>
            <CustomText style={styles.categoryTitle} text={translate("shopping_store.category")} />
            <CustomText numberOfLines={1} style={styles.categoryContent} text={category} />
          </View>
          <CustomText numberOfLines={1} style={styles.price} text={price} styleContainer={styles.priceContainer} />
          <CustomText style={styles.description} text={description} styleContainer={styles.descriptionContainer} />
        </View>
      </View>
    );
  };

  const onPressCall = () => {
    const phoneNumber = owner && owner.phone ? (owner.phone_code ? owner.phone_code : "") + owner.phone : '';
    Alert.alert(translate('about_seller.title_call_seller'),
      translate('about_seller.des_call_seller', { phone: phoneNumber }), [
      {
        text: translate('about_seller.call'),
        onPress: onCallSeller,
      },
      {
        style: 'cancel',
        text: translate('about_seller.cancel'),
      },
    ]);
  };

  const renderSeller = () => {
    if (product && product.owner) {
      return (
        <AboutSeller
          containerStyle={styles.sellerContainer}
          data={product.owner}
          onPress={onPressCall}
        />
      );
    } else {
      return null;
    }
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchRelativeProduct(page, onLoadSuccess, onLoadFailure);
  };

  const onPressProductItem = (item: ShoppingStoreItemModal) => {
    NavigationActionsService.push(WHOLE_STORE_DETAILS_TENANT, { data: item });
  };

  const renderItemShoppingStore = (item: ShoppingStoreItemModal, index: number) => {
    return (
      <ShoppingStoreItem
        isOdd={index % 2 == 0}
        item={item}
        onPressDetail={onPressProductItem.bind(undefined, item)}
      />
    );
  };

  const renderRelatedProduct = () => {
    return (
      <View style={styles.relatedProductContainer}>
        <CustomSectionHeader
          title={translate("shopping_store.related_products")}
          styleIcon={{ width: 0, height: 0 }}
        />
        <View style={styles.relatedProductList}>
          <CustomFlatList
            onLoad={onLoad}
            horizontal
            data={relativeData}
            renderItem={renderItemShoppingStore}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, }}
          />
        </View>
      </View>
    );
  };


  const onCallSeller = () => {
    let phoneNumber = owner && owner.phone ? (owner.phone_code ? owner.phone_code : "") + owner.phone : '';
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${owner && owner.phone ? (owner.phone_code ? owner.phone_code : "") + owner.phone : ''}`;
    }
    else {
      phoneNumber = `tel:${owner && owner.phone ? (owner.phone_code ? owner.phone_code : "") + owner.phone : ''}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <Container
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate("shopping_store.store")}
      spaceBottom={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("shopping_store.whole_store_section_header")}
        icon={IC_SHOPPING_STORE}
      />
      <ScrollView style={styles.container}>
        {renderProductContent()}
        {renderSeller()}
        {renderRelatedProduct()}
      </ScrollView>
    </Container>
  );
};
export default React.memo(WholeStoreDetailsTenant);
