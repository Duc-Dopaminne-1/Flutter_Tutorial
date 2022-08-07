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
import { FILTER, PRODUCT_DETAIL, FILTER_TENANT } from '@src/constants/screenKeys';
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
import ICON_MY_SALE from "@res/icons/icon-my-sale.png";

export type ProductItemModal = {
  thumbnail: string[],
  title: string,
  date: string,
  description: string,
  price: string,
  status: string,
  category: string,

}

const MySaleList: FunctionComponent<{
  headerTitle: string,
  showGrid?: boolean,
  containerStyles?: ViewStyle,
  isShowFilter?: boolean,
  filterData?: ObjDropdown[],

}> = ({
  headerTitle = 'MY SALE',
  showGrid = false,
  containerStyles = {},
  isShowFilter = true,

}) => {
    const dispatch = useDispatch();
    const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
    const shoppingProductList = useSelector<RootState, IPagination<IProductGetResponse>>((state: RootState) => state.shoppingStore.listShoppingProduct!);
    const [isGrid, setIsGrid] = useState(showGrid);
    const [isLoadedData, setLoadedData] = useState(false);
    const listRef = useRef<any>(null);
    const gridRef = useRef<any>(null);

    useEffect(() => {
    }, []);

    const onChangeLayout = () => {
      setIsGrid(!isGrid);
    };

    const onPressProductItem = (data: IProductGetResponse) => {
      NavigationActionsService.push(PRODUCT_DETAIL, { data, listRef, gridRef });
    };


    const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    };



    const renderGridLayout = () => {
      return (
        <CustomFlatList
          key='Grid'
          ref={gridRef}
          onLoad={onLoad}
          columnWrapperStyle={styles.columnWrapperStyle}
          horizontal={false}
          numColumns={2}
          data={shoppingProductList.results}
          contentContainerStyle={styles.contentContainerStyleGrid}
          renderItem={(item: IProductGetResponse, index: number) => {
            const price = item.price ? formatCurrency(item.price, item.currency) : '';
            return (
              <ProductItemGrid
                styleContainer={styles.productItemGrid}
                name={item.name}
                icon={item.thumbnail}
                description={item.description}
                onPress={() => onPressProductItem(item)} />
            );
          }}
          keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
          style={{ backgroundColor: 'white' }}
          hasNext={shoppingProductList.next !== null}
          loadMore
          pullToRefresh
        />
      );
    };

    const renderListLayout = () => {
      return (
        <CustomFlatList
          key='List'
          ref={listRef}
          onLoad={onLoad}
          data={shoppingProductList.results}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={(item: IProductGetResponse, index: number) => {
            const price = item.price ? formatCurrency(item.price, item.currency) : '';
            return (
              <ProductItem
                icon={item.thumbnail}
                name={item.name}
                description={item.description}
                isLineBottom={(index == shoppingProductList.results.length - 1) ? false : true}
                onPress={() => onPressProductItem(item)} />
            );
          }}
          keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
          style={{ backgroundColor: 'white' }}
          hasNext={shoppingProductList.next !== null}
          loadMore
          pullToRefresh
        />
      );
    };

    const onApplyFilter = (filter: any) => {

    };

    const onPressFilter = () => {
      NavigationActionsService.push(FILTER_TENANT);
    };

    const renderHeader = () => {
      return <CustomSectionHeader
        style={styles.sectionHeader}
        title={headerTitle}
        icon={ICON_MY_SALE}
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
            <Image style={styles.imageListStyle} source={isGrid ? ICON_LIST : ICON_GRID} resizeMode='contain' />
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

export default React.memo(MySaleList);
