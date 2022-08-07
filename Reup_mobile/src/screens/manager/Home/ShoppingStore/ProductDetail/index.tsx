import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Linking, Platform } from 'react-native';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import AboutSeller, { SellerModel } from '@src/components/AboutSeller';
import { useRoute } from '@react-navigation/native';
import { ProductItemModal } from '@src/components/ProductList';
import { CustomButton } from '@src/components/CustomButton';
import { CustomText } from '@src/components/CustomText';
import ShowingImages from '@src/components/ShowingImages';
import { formatCurrency, upperCaseFirstChar } from '@src/utils';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatusShoppingProduct } from '@src/modules/shopping_store/action';
import NavigationActionsService from '@src/navigation/navigation';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IProductChangeStatus } from '@reup/reup-api-sdk/libs/api/shopping_store/product';

interface Props {
  data: IProductGetResponse;
  listRef?: any;
  gridRef?: any;
}

const ProductDetail = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const route = useRoute();
  const { data, listRef, gridRef } = route.params as Props;
  const [selectedIndex, setSelecteIndex] = useState<number>(0);

  const onApprove = () => {
    const companyId = me && me.default_company ? me.default_company.id : '';
    const id = data ? data.id : '';
    const params: IProductChangeStatus = {
      status: ShoppingProductStatus.Approved
    };

    NavigationActionsService.showLoading();
    dispatch(
      changeStatusShoppingProduct({
        companyId,
        id,
        params,
        onSuccess: data => {
          listRef && listRef.current && listRef.current.reloadData();
          gridRef && gridRef.current && gridRef.current.reloadData();
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onDenied = () => {
    const companyId = me && me.default_company ? me.default_company.id : '';
    const id = data ? data.id : '';
    const params: IProductChangeStatus = {
      status: ShoppingProductStatus.Denied
    };

    NavigationActionsService.showLoading();
    dispatch(
      changeStatusShoppingProduct({
        companyId,
        id,
        params,
        onSuccess: data => {
          listRef && listRef.current && listRef.current.reloadData();
          gridRef && gridRef.current && gridRef.current.reloadData();
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onSelectImage = (index: number) => {
    setSelecteIndex(index);
  };

  const renderProductContent = () => {
    const name = data.name ? data.name : "";
    const date = data.created ? translate("shopping_store.post_on") + data.created : "";
    const imageList = data.image_urls ? data.image_urls : [];
    const category = data.category ? data.category.name : "";
    const price = data.price ? `${formatCurrency(data.price, data.currency)}` : "";
    const description = data.description ? data.description : "";
    const status = data.status ? upperCaseFirstChar(data.status) : "";

    let statusColor = "";
    if (status === upperCaseFirstChar(ShoppingProductStatus.Waiting.valueOf())) {
      statusColor = "#707070";
    } else if (status === upperCaseFirstChar(ShoppingProductStatus.Denied.valueOf())) {
      statusColor = "#333333";
    } else {
      statusColor = "#1B72BF";
    }

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
          <View style={styles.statusContainer}>
            <CustomText style={styles.categoryTitle} text={`${translate("filter.status")}: `} />
            <CustomText numberOfLines={1} style={[styles.categoryContent, { color: statusColor }]} text={status} />
          </View>
          <CustomText style={styles.description} text={description} styleContainer={styles.descriptionContainer} />
        </View>
      </View>
    );
  };

  const renderBottomButton = () => {
    return (
      <View style={styles.bottomButtonView}>
        <CustomButton onPress={onApprove} text={translate("post.detail_approve_button")} style={[styles.widthButton, styles.approveButton]} />
        <CustomButton onPress={onDenied} text={translate("post.detail_deny_button")} textStyle={styles.denyText} style={[styles.widthButton, styles.denyButton]} />
      </View>
    );
  };

  const onPressCall = () => {
    const phoneNumber = data.owner && data.owner.phone
      ? (data.owner.phone_code ? data.owner.phone_code : "") + data.owner.phone
      : (data.owner.phone1_code ? data.owner.phone1_code : "") + data.owner.phone1;

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
    if (data && data.owner) {
      return (
        <AboutSeller containerStyle={styles.sellerContainer} data={data.owner} onPress={onPressCall} />
      );
    } else {
      return null;
    }
  };


  const onCallSeller = () => {
    const phoneNumber = data.owner && data.owner.phone
      ? (data.owner.phone_code ? data.owner.phone_code : "") + data.owner.phone
      : (data.owner.phone1_code ? data.owner.phone1_code : "") + data.owner.phone1;

    let phone = '';
    if (Platform.OS !== 'android') {
      phone = `telprompt:${phoneNumber}`;
    }
    else {
      phone = `tel:${phoneNumber}`;
    }

    Linking.canOpenURL(phone)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phone);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <Container
      isShowHeader={true}
      title={translate("shopping_store.title")}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      spaceBottom={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("shopping_store.section_header")}
        icon={ICON_HOME_SALE}
      />
      <ScrollView style={styles.container}>
        {renderProductContent()}
        {renderSeller()}
      </ScrollView>
      {data.status && data.status === ShoppingProductStatus.Waiting ? renderBottomButton() : null}
    </Container>
  );
};
export default ProductDetail;
