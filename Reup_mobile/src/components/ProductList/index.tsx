import React, { FunctionComponent, useState, useRef, useEffect } from 'react';
import { View, Image, Text, FlatList, Alert } from 'react-native';
import { CustomButton } from '../CustomButton';
import { CustomTouchable } from '@components/CustomTouchable';
import ProductItem from '@components/ProductItem';
import ProductItemGrid from '@components/ProductItemGrid';
import { Props as Item } from '@components/ForLeaseForSale/ItemForLeaseForSale';
import styles from './styles';
import ICON_NEW_PRODUCTS from '@res/icons/icon-section/icon-section.png';
import ICON_GRID from '@res/icons/grid-icon/grid-icon.png';
import ICON_LIST from '@res/icons/list-icon/icon-list.png';
import ICON_ARROW_DOWN from '@res/icons/ForLeaseForSale/icon-double-arrow-down.png';
import { ViewStyle } from 'react-native-phone-input';
import { ObjDropdown } from '../Dropdown/DropdownNative';
import { CustomFlatList } from '../FlatList';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER, PRODUCT_DETAIL } from '@src/constants/screenKeys';
import CustomSectionHeader from '../CustomSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { QueryShoppingProductParams } from '@reup/reup-api-sdk/libs/api/shopping_store/product';
import { getListShoppingProduct, getListProductCategory } from '@src/modules/shopping_store/action';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IProductGetResponse, IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { upperCaseFirstChar, formatCurrency } from '@src/utils';
import { ShoppingProductStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { Config } from '@src/configs/appConfig';
import { formatDateWith } from '@src/utils/date';
import { find } from 'lodash';


export type ProductItemModal = {
  thumbnail: string[],
  title: string,
  date: string,
  description: string,
  price: string,
  status: string,
  category: string,

}

const ProductList: FunctionComponent<{
  headerTitle: string,
  showGrid?: boolean,
  containerStyles?: ViewStyle,
  datePickerContainerStyle?: ViewStyle,
  isShowFilter?: boolean,
  filterData?: ObjDropdown[],
  status?: string,
  isShowStatus?: boolean,
  isShowViewMore?: boolean,
  onPressViewMore?: () => void
}> = ({
  headerTitle = 'FOR LEASE - FOR SALE',
  showGrid = false,
  containerStyles = {},
  isShowStatus = false,
  isShowFilter = true,
  isShowViewMore = true,
  onPressViewMore
}) => {
    const dispatch = useDispatch()
    const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
    const shoppingProductList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listShoppingProduct!);
    const [isGrid, setIsGrid] = useState(showGrid);
    const [isLoadedData, setLoadedData] = useState(false);
    const listRef = useRef<any>(null);
    const gridRef = useRef<any>(null);
    const sizeItemHome = 4;
    const [params, setParams] = useState<QueryShoppingProductParams>({
      country_id: '',
      property_id: '',
      category_id: '',
      from_date: '',
      to_date: '',
    });

    const [dataCategory, setDataCategory] = useState<ObjDropdown[]>([]);

    const dataStatus: ObjDropdown[] = [
      { _key: '', _value: 'Please Choose' },
      { _key: ShoppingProductStatus.Waiting, _value: upperCaseFirstChar(ShoppingProductStatus.Waiting.valueOf()) },
      { _key: ShoppingProductStatus.Approved, _value: upperCaseFirstChar(ShoppingProductStatus.Approved.valueOf()) },
      { _key: ShoppingProductStatus.Denied, _value: upperCaseFirstChar(ShoppingProductStatus.Denied.valueOf()) },
    ]

    const dataShowBy = [
      { _key: '', _value: translate('filter.please_choose') },
      { _key: "0", _value: translate('filter.all_time') },
      { _key: "1", _value: translate('filter.specific_time') }
    ];

    useEffect(() => {
      onGetListProductCategory();
    }, [])

    useEffect(() => {
      if (isLoadedData && me && me.default_company && me.default_company.id) {
        const params = {
          country_id: '',
          property_id: '',
          category_id: '',
          from_date: '',
          to_date: '',
        }
        onReloadDataWithParams(params)
        onGetListProductCategory();
      }
    }, [me.default_company.id])

    const onGetListProductCategory = () => {
      const companyId = me && me.default_company ? me.default_company.id : '';
      dispatch(
        getListProductCategory({
          isSave: false,
          id: companyId,
          page: 1,
          limit: Config.Manager.limitGetAll,
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

    const onGetListShoppingStore = (page: number, params: QueryShoppingProductParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
      if (me && me.default_company) {
        const companyId = me.default_company.id ?? '';
        dispatch(
          getListShoppingProduct({
            id: companyId,
            page,
            params,
            isSave: true,
            limit: Config.Manager.limitPage,
            onSuccess: data => {
              onLoadSuccess && onLoadSuccess();
              setLoadedData(true)
            },
            onFail: error => {
              onLoadFailure && onLoadFailure();
              setLoadedData(true)
              setTimeout(() => {
                error && Alert.alert(translate('alert.title_error'), error.message);
              }, 700);
            }
          })
        )
      }
    }

    const onChangeLayout = () => {
      setIsGrid(!isGrid);
    };

    const onPressProductItem = (data: IProductGetResponse) => {
      NavigationActionsService.push(PRODUCT_DETAIL, { data, listRef, gridRef });
    };

    const renderViewMore = () => {
      if (isShowViewMore && shoppingProductList.results.length > 0) {
        return (
          <CustomButton
            style={[styles.viewMore, isGrid ? { marginTop: 20 } : null]}
            text={translate("global.view_more")}
            textStyle={styles.textViewMore}
            iconRight={ICON_ARROW_DOWN}
            iconRightStyle={styles.iconViewMore}
            onPress={onPressViewMore}
          />
        );
      } else {
        return null;
      }
    };

    const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
      onGetListShoppingStore(page, params, onLoadSuccess, onLoadFailure)
    };

    const onReloadDataWithParams = (params: QueryShoppingProductParams) => {
      setParams(params)
      if (listRef && listRef.current) {
        listRef.current.resetInitPage(1);
        listRef.current.scrollToTop();
      }

      if (gridRef && gridRef.current) {
        gridRef.current.resetInitPage(1);
        gridRef.current.scrollToTop();
      }
      setTimeout(() => {
        onGetListShoppingStore(1, params);
      }, 200)
    }

    const renderGridLayout = () => {
      const data = isShowViewMore ? shoppingProductList.results.slice(0, sizeItemHome) : shoppingProductList.results;
      return (
        <CustomFlatList
          key='Grid'
          ref={gridRef}
          onLoad={onLoad}
          columnWrapperStyle={styles.columnWrapperStyle}
          horizontal={false}
          numColumns={2}
          data={data}
          contentContainerStyle={styles.contentContainerStyleGrid}
          renderItem={(item: IProductGetResponse, index: number) => {
            const status = item.status ? upperCaseFirstChar(item.status) : '';
            const price = item.price ? formatCurrency(item.price, item.currency) : ''
            return (
              <ProductItemGrid
                styleContainer={styles.productItemGrid}
                name={item.name}
                icon={item.thumbnail}
                description={item.description}
                isShowStatus={isShowStatus}
                price={`${price}`}
                status={status}
                onPress={() => onPressProductItem(item)} />
            );
          }}
          keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
          listFooterComponent={renderViewMore}
          style={{ backgroundColor: 'white' }}
          hasNext={shoppingProductList.next}
          loadMore
          pullToRefresh
        />
      );
    };

    const renderListLayout = () => {
      const data = isShowViewMore ? shoppingProductList.results.slice(0, sizeItemHome) : shoppingProductList.results;
      return (
        <CustomFlatList
          key='List'
          ref={listRef}
          onLoad={onLoad}
          data={data}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={(item: IProductGetResponse, index: number) => {
            const status = item.status ? upperCaseFirstChar(item.status) : '';
            const price = item.price ? formatCurrency(item.price, item.currency) : ''
            return (
              <ProductItem
                icon={item.thumbnail}
                name={item.name}
                description={item.description}
                isShowStatus={isShowStatus}
                price={`${price}`}
                status={status}
                isLineBottom={(index == data.length - 1) ? false : true}
                onPress={() => onPressProductItem(item)} />
            );
          }}
          keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
          listFooterComponent={renderViewMore}
          style={{ backgroundColor: 'white' }}
          hasNext={shoppingProductList.next}
          loadMore
          pullToRefresh
        />
      );
    };

    const onApplyFilter = (filter: any) => {
      const findStatus = filter.status && find(dataStatus, { _key: filter.status });
      let p: QueryShoppingProductParams = {
        country_id: filter.country ?? '',
        property_id: filter.building ?? '',
        category_id: filter.category ?? ''
      };
      const filterShowBy = filter.showBy && dataShowBy.find(item => item._key === filter.showBy);
      if (filterShowBy && filterShowBy._key == '1') {
        p = {
          ...p,
          from_date: formatDateWith(filter.from, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
          to_date: formatDateWith(filter.to, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
        }
      } else {
        p = {
          ...p,
          from_date: '',
          to_date: '',
        }
      }

      const params: QueryShoppingProductParams = findStatus ? { ...p, status: findStatus._key } : p;
      onReloadDataWithParams(params);
    };

    const onPressFilter = () => {
      NavigationActionsService.push(FILTER, {
        numberOfInput: 1,
        isCategory: true,
        isShowBy: true,
        dataShowBy: dataShowBy,
        isStatus: true,
        indexStatus: 0,
        dataStatus: dataStatus,
        dataCategory: dataCategory,
        onFilter: onApplyFilter
      });
    };

    const renderHeader = () => {
      return <CustomSectionHeader
        style={styles.sectionHeader}
        title={headerTitle}
        icon={ICON_NEW_PRODUCTS}
        isShowFilter={isShowFilter}
        onPressFilter={onPressFilter}
      />;
    };

    const renderShowProductListAs = () => {
      return (
        <View style={styles.headers}>
          <View style={styles.headersLeft}>
            <Text style={styles.title}>{`${translate("product_list.show_product_list_as")}:`}</Text>
          </View>
          <CustomTouchable style={styles.customTouchable} onPress={onChangeLayout}>
            <Image style={{ width: 30, height: 30 }} source={isGrid ? ICON_LIST : ICON_GRID} resizeMode='contain' />
          </CustomTouchable>
        </View>
      );
    };

    return (
      <View style={[styles.containers, containerStyles]}>
        {renderHeader()}
        {shoppingProductList.results.length > 0 ? renderShowProductListAs() : null}
        {isGrid ? renderGridLayout() : renderListLayout()}
      </View >
    );
  };

export default React.memo(ProductList);
