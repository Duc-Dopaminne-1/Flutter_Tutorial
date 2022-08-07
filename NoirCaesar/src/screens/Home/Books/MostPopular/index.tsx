import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { getList } from '@src/modules/books/actions';
import { BookListModeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { colors } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_INFO_DETAIL } from '@src/constants/screenKeys';
import EmptyData from '@src/components/EmptyData';

let isFirstLoad = true;
const MostPopular = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listPopular = useSelector<RootState, IPagination<IBook>>((state: RootState) => state.book.listMostPopular);

  const onPressItem = (item: IBook) => {
    NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: item.id }, true);
  };

  useEffect(() => {
    getListMostPopular();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }
      dispatch(
        getList({
          mode: BookListModeEnum.Popular,
          page: page,
          limit: 18,
          onSuccess: () => {
            setPage(page + 1);
            setTimeout(() => {
              setIsRefreshing(false);
              setLoading(false);
            }, 500);
          },
          onFail: error => {
            setIsRefreshing(false);
            setTimeout(() => {
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  const getListMostPopular = () => {
    setLoading(true);
  };

  const handleLoadMore = () => {
    if (!loading && listPopular.next !== null && listPopular.results.length !== listPopular.count) {
      getListMostPopular();
    }
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPage(1);
      getListMostPopular();
    }, 500);
  };

  const renderItem = ({ item }: { item: IBook }) => {
    return <BookItem url={item.image_thumb} title={item.name} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const renderFooter = () => {
    return loading && listPopular.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderListPopular = () => (
    <FlatList
      contentContainerStyle={styles.flatList}
      data={listPopular.results}
      numColumns={3}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={renderRefreshControl()}
      ListEmptyComponent={<EmptyData />}
    />
  );

  return <View style={styles.container}>{renderListPopular()}</View>;
};

export { MostPopular };
