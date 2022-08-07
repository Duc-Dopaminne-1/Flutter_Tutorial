import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IChapter, IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { getListChapter } from '@src/modules/books/actions';
import { usePrevious } from '@src/hooks/usePrevious';
import { colors } from '@src/constants/vars';
import { ChaptersItem } from '@src/components/FlatListItem/ChaptersItem';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_READER } from '@src/constants/screenKeys';
import EmptyData from '@src/components/EmptyData';

interface Props {
  bookId: string;
  is_collection?: boolean;
  bookDetails: IBook;
}

let isFirstLoad = true;

const Chapters = (props: Props) => {
  const { bookDetails } = props;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const previousLoading = usePrevious(loading);
  const [listChapter, setListChapter] = useState<IPagination<IChapter>>({
    count: 0,
    next: '',
    previous: '',
    results: [],
  })

  useEffect(() => {
    getListChapterAction();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
      }
      dispatch(
        getListChapter({
          book_id: props.bookId,
          is_collection: props.is_collection,
          limit: 10,
          page: page,
          onSuccess: (value: IPagination<IChapter>) => {
            if (page == 1) {
              setListChapter(value)
            } else {
              setListChapter({
                count: value.count,
                next: value.next,
                previous: value.previous,
                results: [...listChapter.results, ...value.results]
              })
            }
            setPage(page + 1);
            setTimeout(() => {
              setLoading(false);
            }, 500);
          },
          onFail: error => {
            setTimeout(() => {
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  const getListChapterAction = () => {
    setLoading(true);
  };

  const refreshData = () => {
    setPage(1);
    getListChapterAction();
  }

  const onPressChapterItem = (item: IChapter) => {
    NavigationActionsService.showModal(BOOK_READER, { item, is_collection: props.is_collection, bookDetails });
  };

  const renderItem = ({ item }: { item: IChapter }) => {
    return <ChaptersItem
      item={item}
      bookImage={bookDetails.image_thumb}
      onCustomPress={onPressChapterItem.bind(undefined, item)}
      onRefreshData={refreshData} />;
  };

  const keyExtractor = (item: IChapter, index: number) => {
    return index.toString();
  };

  const handleLoadMore = () => {
    if (!loading && listChapter.next !== null && listChapter.results.length !== listChapter.count) {
      getListChapterAction();
    }
  };

  const renderFooter = () => {
    return loading && listChapter.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderListChapter = () => (
    <FlatList
      data={listChapter.results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      ListEmptyComponent={<EmptyData />}
    />
  );

  return <View style={styles.container}>{renderListChapter()}</View>;
};

export { Chapters };
