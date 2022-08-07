import React, { useState } from 'react'
import { Alert, ScrollView, View } from "react-native"
import CustomInfoList, { ItemType } from "@src/components/CustomInfoList"
import styles from './styles'
import Container from '@src/components/Container'
import translate from '@src/localize'
import { upperCase } from 'lodash'
import { CustomButton } from '@src/components/CustomButton'
import { formatCurrency, upperCaseFirstChar } from '@src/utils';
import { IC_SHOPPING_STORE, IC_GREEN_CHECK } from '@src/constants/icons';
import ContinueShopping from '../../../ContinueShoppingTenant';
import NavigationActionsService from '@src/navigation/navigation'
import { EDIT_STORE_TENANT } from '@src/constants/screenKeys'
import { IProductUpdateRequest } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models'
import { ShoppingStoreItemModal } from '@src/components/FlatListItem/ShoppingStoreItem'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@src/types/types'
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models'
import { updateShoppingProduct } from '@src/modules/shopping_store/action'
import { ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum'

interface Props {
  data: ShoppingStoreItemModal;
  myRef: any,
  wholeRef: any,
}

const MyShopDetailsTenant = () => {

  const dispatch = useDispatch()
  const [isContinueShopping, setContinueShopping] = useState<boolean>(false);
  const route = useRoute();
  const { data, myRef, wholeRef } = route.params as Props;
  const product = data && data.product;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultPropertyId = me && me.default_property ? me.default_property : ''

  const updateStatusProduct = () => {
    if (!defaultPropertyId || !product) {
      return
    }
    NavigationActionsService.showLoading()
    const params: IProductUpdateRequest = {
      is_sold: !product.is_sold
    }
    dispatch(
      updateShoppingProduct({
        propertyId: defaultPropertyId,
        id: product.id,
        params,
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
        onSuccess: data => {
          myRef && myRef.current && myRef.current.reloadData()
          wholeRef && wholeRef.current && wholeRef.current.reloadData()
          setTimeout(() => {
            NavigationActionsService.hideLoading()
            NavigationActionsService.pop();
          }, 500);
        }
      })
    )
  }


  //PRODUCT DETAILS DATA
  const productNameField = {
    left: translate('product_details.product_name'),
    right: product.name ?? "",
    itemType: ItemType.TEXT
  }

  const categoryField = {
    left: translate('product_details.category'),
    right: product.category ? product.category.name : '',
    itemType: ItemType.TEXT
  }

  const priceField = {
    left: translate('product_details.price'),
    right: formatCurrency(product.price ?? 0, product.currency),
    itemType: ItemType.TEXT
  }

  const descriptionField = {
    left: translate('product_details.description'),
    right: product.description ?? "",
    itemType: ItemType.TEXT
  }

  const imagesField = {
    left: translate('product_details.images'),
    right: product.image_urls ? product.image_urls : [],
    itemType: ItemType.IMAGE
  }

  const statusField = {
    left: translate('product_details.status'),
    right: product.status ? upperCaseFirstChar(product.status) : '',
    itemType: ItemType.TEXT
  }

  const productDetailsData: any[] = [productNameField, categoryField, priceField, descriptionField, imagesField, statusField];


  const renderPersonalDetailList = () => {
    const title = translate('product_details.title_section')
    return (
      <CustomInfoList
        isShowEdit={true}
        onPressEdit={onPressDirectEditProfile}
        titleText={title}
        listData={productDetailsData}
        titleImage={IC_SHOPPING_STORE}
      />
    )
  }

  const onPressDirectEditProfile = () => {
    NavigationActionsService.push(EDIT_STORE_TENANT, { product, flatList: myRef, wholeStoreList: wholeRef })
  }

  const onPressUnpublic = () => {
    updateStatusProduct()
  }

  const onPressPublic = () => {
    updateStatusProduct()
  }

  const onPressContinueShopping = () => {
    onCloseContinueShopping()
  }

  const onOpenContinueShopping = () => {
    setContinueShopping(true);
  };

  const onCloseContinueShopping = () => {
    setContinueShopping(false);
  };

  const renderUnpublicButton = () => (
    < View style={styles.bottomButtonView} >
      <CustomButton
        text={upperCase(translate('product_details.unpublic'))}
        style={styles.unpublicButton}
        textStyle={styles.textUnpublic}
        onPress={onPressUnpublic}
      />
    </View >
  )

  const renderPublicButton = () => (
    < View style={styles.bottomButtonView} >
      <CustomButton
        text={upperCase(translate('product_details.public_btn'))}
        style={styles.publicButton}
        textStyle={styles.textPublic}
        onPress={onPressPublic}
      />
    </View >
  )

  const renderBottomButton = () => {
    return product.is_sold ? renderPublicButton() : renderUnpublicButton()
  }

  return (
    <Container
      title={translate('product_details.title')}
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      spaceBottom={true}>
      <View style={styles.container}>
        <ScrollView style={styles.containerScrollView}>
          <View style={styles.inputFormSubContainer}>
            {renderPersonalDetailList()}
          </View>
        </ScrollView>
        {product.status !== ShoppingProductStatus.Denied ? renderBottomButton() : null}
      </View>
      <ContinueShopping
        image={IC_GREEN_CHECK}
        visible={isContinueShopping}
        onBackdropPress={onCloseContinueShopping}
        title={translate('product_details.title_popup')}
        content={translate('product_details.thank_you')}
        titleButton={upperCase(translate('product_details.continue_shopping'))}
        onPressContinueShopping={onPressContinueShopping}></ContinueShopping>
    </Container>
  )
}

export default React.memo(MyShopDetailsTenant)
