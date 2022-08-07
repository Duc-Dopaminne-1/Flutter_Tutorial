import styles from './styles';
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import { colors } from '@src/constants/vars';
import { getListCollection } from '@src/modules/auth/actions';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@src/hooks/usePrevious';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_INFO_DETAIL } from '@src/constants/screenKeys';

interface Props {
  bindFunctionRefreshBook?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;
const Books = (props: Props) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const listBooks = useSelector<RootState, IPagination<IBook>>((state: RootState) => state.auth.listUserBook);

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
      }
      getListBook();
    }
  }, [loading]);

  const getListBook = () => {
    dispatch(
      getListCollection({
        type: CategoryCollectionEnum.Book,
        limit: 18,
        page: page,
        onSuccess: () => {
          setPage(page + 1);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
      }),
    );
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
    NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: item.id, is_collection: true }, true);
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

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listBooks.results}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export { Books };
