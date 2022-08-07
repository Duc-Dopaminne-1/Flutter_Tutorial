import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from '../../../../components/app_text';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { scale } from '../../../../utils/responsive';
const PAGE_SIZE = 15;
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { Shadow } from '../../../../constants/stylesCSS';
import { apiGetProductListByProductCode } from '../../../../services/api/masterDataApi';
import ProductCard from '../../../extra_service/component/product_card';
const ExtraServiceTab = props => {
  const { productCode, route } = props;
  const [data, setData] = useState({ list: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onFetchProductList = async page => {
    setCurrentPage(page);
    const skipCount = (page - 1) * PAGE_SIZE;
    const rs = await apiGetProductListByProductCode({
      productCode,
      productType: 3,
      skipCount,
      maxResultCount: PAGE_SIZE
    });
    setLoading(false);
    setIsRefreshing(false);
    if (rs?.data?.success) {
      const { items, totalCount } = rs.data.result.categorys;
      setData({ list: page === 1 ? items : [...data.list, ...items], total: totalCount });
    }
  };
  useEffect(() => {
    onFetchProductList(1);
  }, []);
  const renderItem = ({ item }) => {
    return <ProductCard item={item} route={route} />;
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    onFetchProductList(1);
  };

  const ListFooterComponent = () =>
    loading && currentPage > 1 ? <ActivityIndicator style={{ marginTop: 10 }} /> : null;
  const loadMore = () => {
    if (!loading && data.list?.length < data.total) {
      setLoading(true);
      onFetchProductList(currentPage + 1);
    }
  };
  const _keyExtractor = item => item.id;
  return (
    <FlatList
      contentContainerStyle={styles.wrapper}
      data={data.list || []}
      renderItem={renderItem}
      onEndReached={loadMore}
      onRefresh={onRefresh}
      refreshing={isRefreshing || (currentPage == 1 && loading)}
      showsVerticalScrollIndicator={false}
      keyExtractor={_keyExtractor}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyListContainer}>
            <AppText translate>{'additional_service_profiles.no_products'}</AppText>
          </View>
        ) : null
      }
    />
  );
};

export default ExtraServiceTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  brand: {
    width: scale(40),
    height: scale(40)
  },
  brandContainer: {
    position: 'absolute',
    left: scale(12),
    top: scale(80),
    zIndex: 999,
    width: scale(48),
    height: scale(48),
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: CUSTOM_COLOR.White,
    marginHorizontal: scale(16),
    marginTop: scale(24),
    borderRadius: 8,
    ...Shadow
  },
  img: {
    width: '100%',
    height: scale(140),
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8)
  },
  icNew: {
    position: 'absolute',
    zIndex: 999,
    top: scale(12),
    right: -scale(4)
  },
  contentContainer: {
    paddingTop: SPACING.Medium,
    paddingHorizontal: SPACING.XNormal,
    paddingBottom: SPACING.Medium
  },
  textTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  textDetail: {
    color: CUSTOM_COLOR.GreenBold,
    fontSize: FONT_SIZE.SubHead,
    marginTop: SPACING.Small,
    lineHeight: LINE_HEIGHT.SubHead
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XNormal
  },
  currencyText: {
    marginLeft: scale(6),
    color: CUSTOM_COLOR.Orange,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  currencyIC: {
    width: scale(16),
    height: scale(16)
  },
  btnContainer: {
    marginTop: scale(16),
    marginBottom: scale(16),
    width: '93%',
    alignSelf: 'center'
    // marginHorizontal: scale(12)
  },
  statusContainer: {
    justifyContent: 'center',
    marginVertical: scale(16)
  },
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom,
    paddingHorizontal: SPACING.Medium
  },
  emptyListContainer: {
    paddingTop: scale(50),
    alignItems: 'center'
  }
});
