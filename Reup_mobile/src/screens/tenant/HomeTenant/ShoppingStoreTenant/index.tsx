import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect, useState, useRef } from 'react';
import { Image, View, Alert } from 'react-native';
import CustomSectionHeader from '@src/components/CustomSection';
import { ADD_PLUS, ICON_DELETE, IC_FILTER_SECTION_HEADER, IC_SHOPPING_STORE } from '@src/constants/icons';
import CustomTabbar from '@src/components/CustomTabbar';
import translate from '@src/localize';
import { CustomFlatList } from '@src/components/FlatList';
import { Theme } from '@src/components/Theme';
import ShoppingStoreItem, { ShoppingStoreItemModal, ShoppingStoreType } from '@src/components/FlatListItem/ShoppingStoreItem';
import { IProductGetResponse, IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { clone, debounce } from 'lodash';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ImageButton } from '@src/components/CustomButton';
import NavigationActionsService from '@src/navigation/navigation';
import { MY_SHOP_DETAILS_TENANT, NEW_PRODUCT_TENANT, WHOLE_STORE_DETAILS_TENANT, FILTER_TENANT } from '@src/constants/screenKeys';
import SearchBar from '@src/components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { QueryShoppingProductParams } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/product';
import { SortDir, ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { getListShoppingProduct, getListProductCategory, getMyShopProductList, removeMyShopProduct } from '@src/modules/shopping_store/action';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { LimitLoadMore, LimitGetAll } from '@src/constants/vars';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { upperCaseFirstChar } from '@src/utils';
import { of, combineLatest, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


const ShoppingStoreTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const wholeStoreList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listShoppingProduct);
  const myShopList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listMyProduct);
  const [wholeStoreData, setWholeStoreData] = useState<ShoppingStoreItemModal[]>([])
  const [myShopData, setMyShopData] = useState<ShoppingStoreItemModal[]>([])
  const [myProductSelected, setMyProductSelected] = useState<ShoppingStoreItemModal[]>([])
  const [searchTextWholeStore, setSearchTextWholeStore] = useState<string>('');
  const [searchTextMyShop, setSearchTextMyShop] = useState<string>('')
  const [isLoadedDataWholeStore, setLoadedDataWholeStore] = useState(false);
  const [isLoadedDataMyShop, setLoadedDataMyShop] = useState(false);
  const [dataCategory, setDataCategory] = useState<ObjDropdown[]>([]);
  const dataStatus = [
    { _key: '', _value: 'Please Choose' },
    { _key: ShoppingProductStatus.Waiting, _value: upperCaseFirstChar(ShoppingProductStatus.Waiting.valueOf()) },
    { _key: ShoppingProductStatus.Approved, _value: upperCaseFirstChar(ShoppingProductStatus.Approved.valueOf()) },
    { _key: ShoppingProductStatus.Denied, _value: upperCaseFirstChar(ShoppingProductStatus.Denied.valueOf()) },
  ];

  const debounceLoadDataWholeStore = debounce((p: QueryShoppingProductParams) => {
    onGetListWholeStore(p, 1)
  }, 500);
  const debounceLoadDataMyShop = debounce((p: QueryShoppingProductParams) => {
    onGetListMyShopProduct(p, 1)
  }, 500);
  const flatListWholeStoreRef = useRef<any>(null)
  const flatListMyShopRef = useRef<any>(null)
  const [wholeStoreParams, setWholeStoreParams] = useState<QueryShoppingProductParams>({
    category_id: '',
    search: '',
    sort_dir: SortDir.ASC
  })
  const [myShopParams, setMyShopParams] = useState<QueryShoppingProductParams>({
    category_id: '',
    search: '',
    sort_dir: SortDir.ASC,
    me: true,
    status: undefined
  })

  let removeMyProductObservable: any = null;

  useEffect(() => {
    return () => {
      if (removeMyProductObservable) {
        removeMyProductObservable.unsubscribe();
      }

    }
  }, [])

  useEffect(() => {
    onGetListProductCategory();
  }, [])

  const onGetListProductCategory = () => {
    dispatch(
      getListProductCategory({
        isSave: false,
        id: me.default_property,
        page: 1,
        limit: LimitGetAll,
        onSuccess: data => {
          const mapData = data && data.results && data.results.map((item: IProductCategoryGetResponse) => ({
            _key: item.id ? item.id + "" : '',
            _value: item.name,
          }))
          setDataCategory(mapData);
        }
      })
    )
  }

  useEffect(() => {
    if ((isLoadedDataWholeStore || isLoadedDataMyShop) && me && me.default_property) {
      const pWholeStore = {
        ...wholeStoreParams,
        search: searchTextWholeStore,
      }
      onReloadWholeStoreWithParams(pWholeStore)
      const pMyShop = {
        ...myShopParams,
        search: searchTextMyShop,
      }
      onReloadMyShopWithParams(pMyShop)
      onGetListProductCategory()
    }
  }, [me.default_property])


  // Config Whole Shopping data
  useEffect(() => {
    let listWholeStore: ShoppingStoreItemModal[] = []
    wholeStoreList.results.forEach((item: IProductGetResponse) => {
      const wholeStoreItem: ShoppingStoreItemModal = {
        product: item,
        type: ShoppingStoreType.WHOLE_STORE,
        isSelected: false
      }
      listWholeStore.push(wholeStoreItem);
    })
    setWholeStoreData(listWholeStore);
  }, [wholeStoreList])

  // Config My Shop data
  useEffect(() => {
    let listMyShop: ShoppingStoreItemModal[] = []
    myShopList.results.forEach((item: IProductGetResponse) => {
      const myShopItem: ShoppingStoreItemModal = {
        product: item,
        type: ShoppingStoreType.MY_SHOP,
        isSelected: false
      }
      listMyShop.push(myShopItem);
    })
    setMyShopData(listMyShop);
  }, [myShopList])

  const onFilterWholeStore = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      isCategory: true,
      isCountry: false,
      isBuilding: false,
      dataCategory: dataCategory,
      isSortByLatest: true,
      onFilter: onApplyFilterWholeStore,
    })
  }

  const onApplyFilterWholeStore = (filter: any) => {
    if (filter) {
      let sortBy: SortDir = SortDir.ASC
      if (filter.sortByLatest === 'all') {
        sortBy = SortDir.ASC
      } else {
        sortBy = SortDir.DESC
      }
      const p = {
        category_id: filter.category ?? '',
        search: searchTextWholeStore,
        sort_dir: sortBy,
      }
      onReloadWholeStoreWithParams(p)
    }
  }

  useEffect(() => {
    if (isLoadedDataWholeStore) {
      const p = {
        ...wholeStoreParams,
        search: searchTextWholeStore,
      }
      if (flatListWholeStoreRef && flatListWholeStoreRef.current) {
        flatListWholeStoreRef.current.resetInitPage(1);
        flatListWholeStoreRef.current.scrollToTop();
      }
      debounceLoadDataWholeStore(p);
    }
  }, [searchTextWholeStore])

  const onReloadWholeStoreWithParams = (p: QueryShoppingProductParams) => {
    setMyProductSelected([])
    setWholeStoreParams(p)
    if (flatListWholeStoreRef && flatListWholeStoreRef.current) {
      flatListWholeStoreRef.current.resetInitPage(1);
      flatListWholeStoreRef.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListWholeStore(p, 1);
    }, 200)
  }

  const onGetListWholeStore = (params: QueryShoppingProductParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me.default_property) {
      dispatch(getListShoppingProduct({
        id: me.default_property,
        page,
        limit: LimitLoadMore,
        params,
        isSave: true,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedDataWholeStore(true)
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedDataWholeStore(true)
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }))
    }
  }

  const onLoadWholeStore = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListWholeStore({ ...wholeStoreParams, search: searchTextWholeStore }, page, onLoadSuccess, onLoadFailure)
  }

  const onLoadMyShop = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    setMyProductSelected([])
    onGetListMyShopProduct({ ...myShopParams, search: searchTextMyShop }, page, onLoadSuccess, onLoadFailure)
  }

  const onFilterMyShop = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      isCategory: true,
      isCountry: false,
      isBuilding: false,
      isStatus: true,
      dataStatus: dataStatus,
      dataCategory: dataCategory,
      isSortByLatest: true,
      onFilter: onApplyFilterMyShop,
    })
  }

  const onApplyFilterMyShop = (filter: any) => {
    if (filter) {
      let sortBy: SortDir = SortDir.ASC
      if (filter.sortByLatest === 'all') {
        sortBy = SortDir.ASC
      } else {
        sortBy = SortDir.DESC
      }
      const p = {
        category_id: filter.category ?? '',
        search: searchTextMyShop,
        sort_dir: sortBy,
        status: filter.status ?? undefined,
        me: true
      }
      onReloadMyShopWithParams(p)
    }
  }

  useEffect(() => {
    if (isLoadedDataMyShop) {
      const p = {
        ...myShopParams,
        search: searchTextMyShop,
      }
      if (flatListMyShopRef && flatListMyShopRef.current) {
        flatListMyShopRef.current.resetInitPage(1);
        flatListMyShopRef.current.scrollToTop();
      }
      debounceLoadDataMyShop(p);
    }
  }, [searchTextMyShop])

  const onReloadMyShopWithParams = (p: QueryShoppingProductParams) => {
    setMyShopParams(p)
    if (flatListMyShopRef && flatListMyShopRef.current) {
      flatListMyShopRef.current.resetInitPage(1);
      flatListMyShopRef.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListMyShopProduct(p, 1);
    }, 200)
  }

  const onGetListMyShopProduct = (params: QueryShoppingProductParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me.default_property) {
      dispatch(getMyShopProductList({
        id: me.default_property,
        page,
        limit: LimitLoadMore,
        params,
        isSave: true,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedDataMyShop(true)
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedDataMyShop(true)
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }))
    }
  }

  const onPressCheckItem = (item: ShoppingStoreItemModal) => {
    let selectedItems = clone(myProductSelected);
    if (item.isSelected) {
      selectedItems = myProductSelected.filter(itemA => itemA.product.id != item.product.id);
    } else {
      selectedItems.push(item);
    }
    item.isSelected = !item.isSelected;
    setMyProductSelected(selectedItems);
  }

  const onDeleteItem = () => {
    Alert.alert(translate('alert.message_delete'), translate('shopping_store_tenant.alert_delete'),
      [{
        text: translate('shopping_store_tenant.ok'),
        style: 'default',
        onPress: () => handleRemove()
      },
      {
        style: 'cancel',
        text: translate('shopping_store_tenant.cancel'),
        onPress: () => { }
      }]
    )
  }

  const handleRemove = () => {
    if (myProductSelected.length > 1) {
      const source$ = myProductSelected.map((item: ShoppingStoreItemModal) => {
        return from(removeMultiMyProduct(item.product.id))
      })
      removeMyProductObservable = of(source$).pipe(
        switchMap(() => {
          NavigationActionsService.showLoading();
          return combineLatest(source$)
        }),
        map((response) => {
          NavigationActionsService.hideLoading();
          setLoadedDataMyShop(true)
          if (response && response.filter(item => !item.completed).length > 0) {
            setTimeout(() => {
              Alert.alert(translate('alert.title_error'), translate('alert.message_error_default'));
            }, 700);
            return;
          }
          setMyProductSelected([]);
          onReloadMyShopWithParams(myShopParams);
        })
      ).subscribe();
    } else if (myProductSelected.length === 1) {
      removeMyProduct(myProductSelected[0].product.id)
    }
  }

  const removeMyProduct = (id: string) => {
    if (me && me.default_property ? me.default_property : "" || id) {
      NavigationActionsService.showLoading();
      dispatch(
        removeMyShopProduct({
          propertyId: me.default_property,
          id: id,
          onSuccess: data => {
            setMyProductSelected([]);
            NavigationActionsService.hideLoading();
            onReloadMyShopWithParams(myShopParams)
            setLoadedDataMyShop(true)
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            setLoadedDataMyShop(true)
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          },
        })
      )
    }
  }

  const removeMultiMyProduct = (id: string) => {
    return new Promise<any>((resolve, reject) => {
      if (me && me.default_property ? me.default_property : "" || id) {
        dispatch(
          removeMyShopProduct({
            propertyId: me.default_property,
            id: id,
            onSuccess: data => {
              resolve({ ...data, completed: true });
            },
            onFail: error => {
              resolve({ completed: false })
            },
          })
        )
      }
    })
  }

  const addNewProduct = () => {
    NavigationActionsService.push(NEW_PRODUCT_TENANT, { flatListMyShopRef })
  }

  const onSearchWholeStore = (text: string) => {
    setSearchTextWholeStore(text)
  }

  const onSearchMyShop = (text: string) => {
    setSearchTextMyShop(text)
  }

  const onPressDetailItem = (item: ShoppingStoreItemModal) => {
    switch (item.type) {
      case ShoppingStoreType.WHOLE_STORE:
        NavigationActionsService.push(WHOLE_STORE_DETAILS_TENANT, { data: item });
        break;
      case ShoppingStoreType.MY_SHOP:
        NavigationActionsService.push(MY_SHOP_DETAILS_TENANT, { data: item, myRef: flatListMyShopRef, wholeRef: flatListWholeStoreRef });
        break;
    }
  }

  const renderItemShoppingStore = (item: ShoppingStoreItemModal, index: number) => {
    return (
      <ShoppingStoreItem
        isOdd={index % 2 == 0}
        item={item}
        onPressCheck={onPressCheckItem}
        onPressDetail={onPressDetailItem}
      />
    )
  }

  const renderDeleteButton = () => (
    <View style={styles.deleteButtonContainer}>
      < CustomTouchable style={styles.imageBtnHeader}
        onPress={onDeleteItem} >
        <ImageButton
          onPress={onDeleteItem}
          icon={ICON_DELETE}
          styleContainer={styles.deleteButton}
          styleIcon={styles.iconImageBtn}
        />
      </CustomTouchable >
    </View>
  )

  const renderWholeStoreView = () => (
    <View style={styles.container}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('shopping_store_tenant.whole_store').toUpperCase()}
        icon={IC_SHOPPING_STORE}
        isShowFilter
        onPressFilter={onFilterWholeStore}
      />
      <View style={styles.containerSearchFilterBar}>
        <SearchBar
          value={searchTextWholeStore}
          placeholder={translate("shopping_store_tenant.placeholder_search")}
          onChangeText={onSearchWholeStore}
        />
      </View>
      <CustomFlatList
        ref={flatListWholeStoreRef}
        onLoad={onLoadWholeStore}
        contentContainerStyle={styles.productListContainer}
        numColumns={2}
        data={wholeStoreData}
        indicatorColor={Theme.shopping_store_tenant.indicator}
        renderItem={renderItemShoppingStore}
        pullToRefresh={true}
        hasNext={wholeStoreList.next}
        loadMore={true}
      />
    </View>
  );

  const renderRightComponentMyShop = () => {
    return (
      <View style={styles.rightComponent}>
        {myProductSelected.length > 0 ? renderDeleteButton() : null}
        <View style={styles.buttonAddNew}>
          <ImageButton
            onPress={addNewProduct}
            icon={ADD_PLUS}
            styleContainer={styles.buttonAddNew}
          />
        </View>

        <View>
          <ImageButton
            onPress={onFilterMyShop}
            icon={IC_FILTER_SECTION_HEADER}
            styleIcon={styles.buttonFilter}
          />
        </View>
      </View>
    )
  }

  const renderMyShopView = () => (
    <View style={styles.container}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('shopping_store_tenant.my_shop').toUpperCase()}
        icon={IC_SHOPPING_STORE}
        rightComponent={renderRightComponentMyShop()}
      />
      <View style={styles.containerSearchFilterBar}>
        <SearchBar
          value={searchTextMyShop}
          placeholder={translate("shopping_store_tenant.placeholder_search")}
          onChangeText={onSearchMyShop}
        />
      </View>
      <CustomFlatList
        ref={flatListMyShopRef}
        onLoad={onLoadMyShop}
        contentContainerStyle={styles.productListContainer}
        numColumns={2}
        data={myShopData}
        indicatorColor={Theme.shopping_store_tenant.indicator}
        renderItem={renderItemShoppingStore}
        pullToRefresh={true}
        hasNext={myShopList.next}
        loadMore={true}
      />
    </View>
  );

  const titles = [
    translate('shopping_store_tenant.whole_store'),
    translate('shopping_store_tenant.my_shop')
  ];

  const views = [renderWholeStoreView(), renderMyShopView()]

  return (
    <Container
      isShowHeader={true}
      isDisplayBackButton={false}
      title={translate('shopping_store_tenant.title')}
    >
      <CustomTabbar
        styleContainer={{ marginTop: 8 }}
        styleContentContainer={{ flex: 1 }}
        titles={titles}
        views={views}
      />
    </Container >
  );
};

export default ShoppingStoreTenant;
