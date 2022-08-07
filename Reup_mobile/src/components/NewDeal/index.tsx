import styles from './styles';
import React, { useEffect, useRef, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import CustomSectionHeader from '../CustomSection';
import ICON_NEW_PRODUCTS from '@res/icons/icon-section/icon-section.png';
import { ProductItemModal } from '../ProductList';
import Swiper from 'react-native-swiper';
import ProductItemGrid from '../ProductItemGrid';
import { CustomFlatList } from '../FlatList';
import translate from '@src/localize';
import { CustomText } from '../CustomText';
import IMG_EMPTY from '@src/res/img/empty.png';
import { chunk, take } from 'lodash';
import ShoppingStoreItem, { ShoppingStoreItemModal } from '../FlatListItem/ShoppingStoreItem';
import { WIDTH } from '@src/constants/vars';
interface NewDealProps {
  data: ShoppingStoreItemModal[],
  onPressProductItem?: (item: ShoppingStoreItemModal) => void;
}

const NewDeal = (props: NewDealProps) => {
  const { data, onPressProductItem } = props;
  const [swiperHeight, setSwiperHeight] = useState(0);
  const pageControlHeight = 30;
  const paddingBetweenItem = 30;
  const heightImageItem = (WIDTH - 24) / 2;
  const heightBottomItem = 100;
  const productItemHeight = heightImageItem + heightBottomItem;

  const groupsData: any[] = chunk(take(data, 12), 4);

  useEffect(() => {
    const row = groupsData.length && groupsData[0].length > 2 ? 2 : 1;
    setSwiperHeight(productItemHeight * row + pageControlHeight + paddingBetweenItem);
  }, [data]);

  const renderHeader = () => {
    return (
      <CustomSectionHeader
        title={translate("new_deal.title")}
        icon={ICON_NEW_PRODUCTS}
        style={styles.sectionHeader}
      />
    );
  };
  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  };

  const renderEmpty = () => {
    return (
      <View style={styles.viewEmptyContainer}>
        <Image source={IMG_EMPTY} resizeMode='contain' style={styles.imgEmpty} />
        <CustomText text={translate('empty_in_here')} style={styles.textEmpty} />
      </View>
    );
  };

  const renderItemShoppingStore = (item: ShoppingStoreItemModal, index: number) => {
    return (
      <ShoppingStoreItem
        isOdd={index % 2 == 0}
        item={item}
        onPressDetail={onPressProductItem}
      />
    );
  };

  const renderListItem = (items: ShoppingStoreItemModal[]) => {
    return (
      <CustomFlatList
        key='Grid'
        onLoad={onLoad}
        style={styles.flatList}
        columnWrapperStyle={styles.columnWrapperStyle}
        horizontal={false}
        numColumns={2}
        data={items}
        contentContainerStyle={styles.contentContainerStyleGrid}
        scrollEnabled={false}
        renderItem={renderItemShoppingStore}
        keyExtractor={(item: any, index: number) => {
          return item.product.id;
        }}
      />
    );
  };

  const renderSwiper = () => {
    return (
      <Swiper
        key={data.length}
        style={styles.swiper}
        height={swiperHeight}
        width={WIDTH}
        dot={<View style={styles.unactiveDot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
        loop={false}
        removeClippedSubviews={false}
      >
        {groupsData.map((items: ShoppingStoreItemModal[]) => {
          return (
            renderListItem(items)
          );
        })

        }
      </Swiper>
    );
  };

  return (
    <View style={[styles.container, data.length === 0 ? styles.containerEmpty : {}]}>
      {renderHeader()}
      {data.length === 0 ? renderEmpty() : renderSwiper()}
    </View>
  );

};

export default NewDeal;
