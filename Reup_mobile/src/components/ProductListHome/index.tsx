import React, { useRef, useState } from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";
import CustomSectionHeader from "../CustomSection";
import styles from "./styles";
import ICON_NEW_PRODUCTS from '@res/icons/icon-section/icon-section.png';
import ICON_GRID from '@res/icons/grid-icon/grid-icon.png';
import ICON_LIST from '@res/icons/list-icon/icon-list.png';
import { IProductGetResponse } from "@reup/reup-api-sdk/libs/api/resident/shopping_store/models";
import { CustomText } from "../CustomText";
import translate from "@src/localize";
import { CustomTouchable } from "../CustomTouchable";
import { CustomFlatList } from "../FlatList";
import { formatCurrency, upperCaseFirstChar } from "@src/utils";
import ProductItemGrid from "../ProductItemGrid";
import NavigationActionsService from "@src/navigation/navigation";
import { PRODUCT_DETAIL, SHOPPING_STORE } from "@src/constants/screenKeys";
import { IPagination } from "@reup/reup-api-sdk/libs/type";
import { CustomButton } from "../CustomButton";
import { ICON_ARROW_DOWN } from "@src/constants/icons";
import ProductItem from "../ProductItem";


interface Props {
  containerStyle?: StyleProp<ViewStyle>,
  headerTitle: string,
  isShowFilter?: boolean,
  onPressFilter?: () => void,
  shoppingProductList: IPagination<IProductGetResponse>,
  showGrid?: boolean,
  isShowViewMore?: boolean,
  isShowStatusProduct?: boolean,
  onLoad?: () => void
}

const ProductListHome = (props: Props) => {
  const {
    containerStyle,
    headerTitle = '',
    isShowFilter = false,
    onPressFilter,
    shoppingProductList,
    showGrid = false,
    isShowViewMore = false,
    isShowStatusProduct = false
  } = props;

  const sizeItemHome = 4;
  const gridRef = useRef<any>(null);
  const listRef = useRef<any>(null);
  const [isGrid, setIsGrid] = useState<boolean>(showGrid);

  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={headerTitle}
      icon={ICON_NEW_PRODUCTS}
      isShowFilter={isShowFilter}
      onPressFilter={onPressFilter}
    />;
  };

  const onLoadGrid = () => {

  };

  const onLoadList = () => {

  };

  const onChangeLayout = () => {
    setIsGrid(!isGrid);
  };

  const renderShowProductListAs = () => {
    return (
      <View style={styles.headers}>
        <View style={styles.headersLeft}>
          <CustomText style={styles.title} text={`${translate("product_list.show_product_list_as")}:`} />
        </View>
        <CustomTouchable style={styles.customTouchable} onPress={onChangeLayout}>
          <Image style={styles.iconGrid} source={isGrid ? ICON_LIST : ICON_GRID} resizeMode='contain' />
        </CustomTouchable>
      </View>
    );
  };

  const onPressProductItem = (data: IProductGetResponse) => {
    NavigationActionsService.push(PRODUCT_DETAIL, { data, listRef, gridRef });
  };

  const onPressViewMore = () => {
    NavigationActionsService.push(SHOPPING_STORE);
  };

  const renderViewMore = () => {
    if (shoppingProductList && isShowViewMore && shoppingProductList.results.length > 0) {
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
    }
    return null;
  };

  const renderItemGrid = (item: IProductGetResponse) => {
    const status = item.status ? upperCaseFirstChar(item.status) : '';
    const price = item.price ? formatCurrency(item.price, item.currency) : '';
    return (
      <ProductItemGrid
        styleContainer={styles.productItemGrid}
        name={item.name}
        icon={item.thumbnail}
        description={item.description}
        isShowStatus={isShowStatusProduct}
        price={`${price}`}
        status={status}
        onPress={() => onPressProductItem(item)} />
    );
  };

  const renderGridLayout = () => {
    const data = shoppingProductList && isShowViewMore ? shoppingProductList.results.slice(0, sizeItemHome) : shoppingProductList;
    return (
      <CustomFlatList
        key='Grid'
        ref={gridRef}
        onLoad={onLoadGrid}
        columnWrapperStyle={styles.columnWrapperStyle}
        horizontal={false}
        numColumns={2}
        data={data}
        contentContainerStyle={styles.contentContainerStyleGrid}
        renderItem={renderItemGrid}
        keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
        listFooterComponent={renderViewMore}
        style={styles.gridView}
        hasNext={shoppingProductList.next}
        loadMore
        pullToRefresh
      />
    );
  };

  const renderItemList = (item: IProductGetResponse, isFinalItem: boolean) => {
    const status = item.status ? upperCaseFirstChar(item.status) : '';
    const price = item.price ? formatCurrency(item.price, item.currency) : '';
    return (
      <ProductItem
        icon={item.thumbnail}
        name={item.name}
        description={item.description}
        isShowStatus={isShowStatusProduct}
        price={`${price}`}
        status={status}
        isLineBottom={isFinalItem}
        onPress={() => onPressProductItem(item)} />
    );
  };

  const renderListLayout = () => {
    const data = shoppingProductList && isShowViewMore ? shoppingProductList.results.slice(0, sizeItemHome) : shoppingProductList.results;

    return (
      <CustomFlatList
        key='List'
        ref={listRef}
        onLoad={onLoadList}
        data={data}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={(item: IProductGetResponse, index: number) => renderItemList(item, index !== data.length - 1)}
        keyExtractor={(item: IProductGetResponse, index: number) => String(index)}
        listFooterComponent={renderViewMore}
        style={styles.listView}
        hasNext={shoppingProductList && shoppingProductList.next}
        loadMore
        pullToRefresh
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderHeader()}
      {shoppingProductList && shoppingProductList.results && shoppingProductList.results.length > 0 ? renderShowProductListAs() : null}
      {isGrid ? renderGridLayout() : renderListLayout()}
    </View>
  );
};

export default React.memo(ProductListHome);
