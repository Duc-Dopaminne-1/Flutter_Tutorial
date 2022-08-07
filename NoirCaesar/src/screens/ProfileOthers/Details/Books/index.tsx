import styles from './styles';
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import { colors } from '@src/constants/vars';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@src/hooks/usePrevious';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { getListRetrieveCollection } from '@src/modules/user/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_INFO_DETAIL } from '@src/constants/screenKeys';

interface Props {
  user_id: string,
  bindFunctionRefreshBook?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;
const Books = (props: Props) => {
  const { user_id } = props
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const listBooks = useSelector<RootState, IPagination<IBook>>(state => {
    if (user_id && state.user[user_id]) {
      return state.user[user_id].listUserBook;
    } else {
      return {
        count: 0,
        next: '',
        previous: '',
        results: [],
      };
    }
  });

  useEffect(() => {
    setLoading(true);
    props.bindFunctionRefreshBook && props.bindFunctionRefreshBook(onRefreshBook);
  }, []);

  const onRefreshBook = () => {
    setPage(1);
    setLoading(true);
  };
  useEffect(() => {
    if (loading == true && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }
      getListBook();
    }
  }, [loading]);

  const getListBook = () => {
    dispatch(
      getListRetrieveCollection({
        user_id: props.user_id,
        type: CategoryCollectionEnum.Book,
        limit: 18,
        page: page,
        onSuccess: data => {
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
          }, 500);
        },
      }),
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLoading(true);
      setPage(1);
    }, 500);
  };

  const renderFooter = () => {
    return loading && listBooks.results.length > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const handleLoadMore = () => {
    if (!loading && listBooks.next !== null && listBooks.results.length !== listBooks.count) {
      setLoading(true);
    }
  };

  const onPressItem = (item: IBook) => {
    NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: item.id }, true);
  };

  const renderItem = ({ item }: { item: IBook }) => {
    return (
      <BookItem
        url={item.image_thumb ? item.image_thumb : ''}
        title={item.name ? item.name : ''}
        onPressItem={onPressItem.bind(undefined, item)}
      />
    );
  };

  const keyExtractor = (item: IBook, index: number) => {
    return index.toString();
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listBooks.results}
        numColumns={3}
        renderItem={renderItem}
        refreshControl={renderRefreshControl()}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export { Books };
