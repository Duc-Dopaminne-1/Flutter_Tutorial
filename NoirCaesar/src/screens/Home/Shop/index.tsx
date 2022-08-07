import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { MENU, CART } from '@src/constants/icons';
import { toggleDrawer } from '@src/navigation';
import { StoreItem } from '@src/components/FlatListItem/StoreItem';
import NavigationActionsService from '@src/navigation/navigation';
import { CART_SCREEN, PRODUCT_DETAIL } from '@src/constants/screenKeys';
import { useDispatch, useSelector } from 'react-redux';
import { getListProducts, getProductDetail } from '@src/modules/cart/actions';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IProduct } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { colors } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';

interface IUIState {
  page: number;
  isRefreshing: boolean;
  loading: boolean;
}

const initialState: IUIState = {
  page: 1,
  isRefreshing: false,
  loading: false,
};

const Shop = () => {
  const dispatch = useDispatch();
  const [uiState, setUIState] = useState(initialState);
  const { page, loading, isRefreshing } = uiState;
  const previousLoading = usePrevious(loading);
  const listProducts = useSelector<RootState, IPagination<IProduct>>((state: RootState) => state.cart.products);

  useEffect(() => {
    loadListProduct();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      dispatch(
        getListProducts({
          page: page,
          limit: 18,
          onSuccess: handleLoadListSuccess,
          onFail: handleLoadListFailed,
        }),
      );
    }
  }, [loading]);

  const loadListProduct = () => {
    setUIState({
      ...uiState,
      loading: true
    });
  };

  const handleLoadListSuccess = () => {
    setUIState({
      page: page + 1,
      loading: false,
      isRefreshing: false
    });
  };

  const handleLoadListFailed = () => {
    setUIState({
      ...uiState,
      loading: false,
      isRefreshing: false
    });
  };

  const handleItemPress = (item: IProduct) => {
    NavigationActionsService.showLoading();
    dispatch(
      getProductDetail({
        product_id: item.id,
        onSuccess: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.push(PRODUCT_DETAIL, {}, true);
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
      }),
    );
  };

  const handleRefresh = () => {
    setUIState({
      ...uiState,
      page: 1,
      isRefreshing: true,
      loading: true
    });
  };

  const handleLoadMore = () => {
    if (!loading && !isRefreshing && listProducts.next && listProducts.results.length !== listProducts.count) {
      loadListProduct();
    }
  };

  const renderItem = ({ item }: { item: IProduct }) => {
    return <StoreItem onPressItem={handleItemPress.bind(undefined, item)} item={item} />;
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={handleRefresh} />;
  };

  const renderFooter = () => {
    return loading && listProducts.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const keyExtractor = (item: IProduct, index: number) => {
    return `products-${item.id}`;
  };

  const renderListProduct = () => (
    <FlatList
      style={styles.container}
      numColumns={2}
      contentContainerStyle={styles.flatlist}
      data={listProducts.results}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={renderRefreshControl()}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );

  const renderHeader = () => {
    return (
      <CustomHeader
        mainImage
        leftImage={MENU}
        leftAction={toggleDrawer.bind(undefined, true)}
        rightImage={CART}
        rightAction={onPressCart}
      />
    );
  };

  const onPressCart = () => {
    NavigationActionsService.push(CART_SCREEN, {}, true);
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {renderHeader()}
        {renderListProduct()}
      </View>
    </Container>
  );
};

export default Shop;
