import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { AToZItem } from '../../../../components/FlatListItem/AToZItem';
// @ts-ignore
import AlphabetListView from 'react-native-alphabetlistview';
import { useDispatch, useSelector } from 'react-redux';
import { getList } from '@src/modules/books/actions';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { BookListModeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';
import { RootState } from '@src/types/types';
import { usePrevious } from '@src/hooks/usePrevious';
import { colors } from '@src/constants/vars';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import EmptyData from '@src/components/EmptyData';
import NavigationActionsService from '@src/navigation/navigation';

let isFirstLoad = true;

const AToZ = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const previousLoading = usePrevious(loading);
  const listAZ = useSelector<RootState, IPagination<IBook>>((state: RootState) => state.book.listBookAZ);

  useEffect(() => {
    getListAZAction();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }

      dispatch(
        getList({
          mode: BookListModeEnum.Az,
          limit: 10,
          page: page,
          onSuccess: () => {
            setPage(page + 1);
            setTimeout(() => {
              setIsRefreshing(false);
              setLoading(false);
            }, 500);
          },
          onFail: error => {
            setTimeout(() => {
              setIsRefreshing(false);
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  useEffect(() => {
    if (listAZ.results.length > 0) {
      handleListAZ(listAZ.results);
    }
  }, [listAZ]);

  const getListAZAction = () => {
    setLoading(true);
  };

  const handleListAZ = (list: IBook[]) => {
    const cloneData: any = {};
    for (let i = 0; i < list.length; i++) {
      const firstChar = list[i].name.charAt(0).toUpperCase();
      if (cloneData[firstChar]) {
        cloneData[firstChar].push(list[i]);
      } else {
        cloneData[firstChar] = [list[i]];
      }
    }
    setData(cloneData);
  };

  const handleLoadMore = () => {
    if (!loading && listAZ.next !== null && listAZ.results.length !== listAZ.count) {
      getListAZAction();
    }
  };

  const renderItem = ({ item }: { item: IBook }) => {
    return <AToZItem item={item} />;
  };

  const renderFooter = () => {
    return loading && listAZ.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPage(1);
      getListAZAction();
    }, 500);
  };

  const renderListAZ = () => (
    <AlphabetListView
      data={data}
      cell={renderItem}
      cellHeight={110}
      sectionHeaderHeight={22.5}
      sectionListFontStyle={styles.scrollBarColor}
      sectionListStyle={styles.sectionListStyle}
      refreshControl={renderRefreshControl()}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<EmptyData />}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
    />
  );

  return <View style={styles.container}>{renderListAZ()}</View>;
};

export { AToZ };
