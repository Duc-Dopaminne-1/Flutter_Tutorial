import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from "react";
import { View, Image, Alert } from 'react-native';
import { CustomFlatList } from '@src/components/FlatList';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { IC_PRODUCT_CATEGORY, ICON_DELETE, ADD_PLUS } from '@src/constants/icons';
import { ImageButton, CustomButton } from '@src/components/CustomButton';
import { getSelectedIds } from '@src/utils';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_PRODUCT_CATEGORY, EDIT_PRODUCT_CATEGORY } from '@src/constants/screenKeys';
import { ProductCategoryModel } from '@src/components/FlatListItem/ProductCategoryItem/Models';
import ProductCategoryItem from '@src/components/FlatListItem/ProductCategoryItem';
import { clone, debounce } from "lodash";
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { RootState } from '@src/types/types';
import { useSelector, useDispatch, } from 'react-redux';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { getListProductCategory, deleteProductCategory } from '@src/modules/shopping_store/action';

const ProductCategory = () => {

  const dispatch = useDispatch();
  const productCategoryList = useSelector<RootState, IPagination<IProductCategoryGetResponse>>((state: RootState) => state.shoppingStore.listProductCategory);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [data, setData] = useState<(IProductCategoryGetResponse & { isActive: boolean })[]>([]);
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);


  let defaultCompanyId = '';
  if (me && me.default_company) {
    defaultCompanyId = me.default_company.id;
  }

  useEffect(() => {
    setData(productCategoryList.results.map(item => {
      return {
        ...item,
        isActive: false
      };
    }));
  }, [productCategoryList]);

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      setTimeout(() => {
        fetchData(1);
      }, 200);
    }
  }, [me.default_company.id]);

  const fetchData = (page: number, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    dispatch(
      getListProductCategory({
        id: defaultCompanyId,
        page,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedData(true);
          console.log("===== Success list product category: ", data);
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedData(true);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onDeleteCategory = (id: string) => {
    NavigationActionsService.showLoading();
    dispatch(deleteProductCategory({
      companyId: defaultCompanyId,
      id: id,
      onSuccess: (data) => {
        flatList && flatList.current && flatList.current.reloadData();
        console.log("===== Success Delete maintenance category: ", data);
        NavigationActionsService.hideLoading();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (me && me.default_company) {
      fetchData(page, onLoadSuccess, onLoadFailure);
    }
  };

  const onDeleteItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          data.forEach(item => {
            if (item.isActive) {
              onDeleteCategory(item.id);
            }
          });
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };

  const onPressItemCheck = (index: number) => {
    const cloneData = clone(data);
    cloneData[index].isActive = !cloneData[index].isActive;
    setData(cloneData);
  };

  const onPressItem = (category: IProductCategoryGetResponse & { isActive: boolean }) => {
    NavigationActionsService.push(EDIT_PRODUCT_CATEGORY, { category, flatList });
  };

  const onPressAdd = () => {
    NavigationActionsService.push(NEW_PRODUCT_CATEGORY, { flatList });
  };

  const getButtonDeleteState = () => {
    return productCategoryList.results.length > 0 && data.filter(item => item.isActive).length > 0;
  };

  const _renderItem = (item: IProductCategoryGetResponse & { isActive: boolean }, index: number) => {
    return (
      <ProductCategoryItem
        item={item}
        index={index}
        onPressItem={onPressItem}
        onPressItemCheck={onPressItemCheck} />
    );
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <View style={styles.lineTransparent} />
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const renderListLayout = () => {
    return (
      <CustomFlatList
        onLoad={onLoad}
        ref={flatList}
        style={styles.customFlatList}
        contentContainerStyle={styles.containerFlatlist}
        data={data}
        renderItem={_renderItem}
        ItemSeparatorComponent={_itemSeparator}
        pullToRefresh={true}
        hasNext={productCategoryList.next}
        loadMore={true}
      />
    );
  };

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("product_category.product_header")}
        icon={IC_PRODUCT_CATEGORY}
        rightComponent={
          getButtonDeleteState() ? <ImageButton
            onPress={onDeleteItem}
            icon={ICON_DELETE}
            styleContainer={styles.containerImageBtn}
            styleIcon={styles.iconImageBtn}
          /> : undefined
        }
        styleRightComponent={styles.imageBtnHeader}
      />
    );
  };

  const renderButton = () => (
    <View style={styles.buttonBottom}>
      <CustomButton
        onPress={onPressAdd}
        iconLeft={ADD_PLUS}
        text={translate('product_category.button_add')}
        style={styles.button} />
    </View>
  );
  return (
    <Container isShowHeader={true} title={translate('product_category.product_title')}>
      <View style={styles.container}>
        {renderHeader()}
        {renderListLayout()}
        {renderButton()}
      </View>
    </Container >
  );
};

export default ProductCategory;
