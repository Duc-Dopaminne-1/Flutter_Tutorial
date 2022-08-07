import styles from './styles';
import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, ScrollView, ActivityIndicator, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import DrawerLayout, { DrawerState } from 'react-native-gesture-handler/DrawerLayout';
import { WIDTH_GENRES, colors } from '@src/constants/vars';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { showGenresMenu, getGenres as actionGetGenres, setSelectedGenres, getList } from '@src/modules/books/actions';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import translate from '@src/localize';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook, IGenres } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { BookListModeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_INFO_DETAIL } from '@src/constants/screenKeys';
import { CustomTouchable } from '@src/components/CustomTouchable';
import EmptyData from '@src/components/EmptyData';
import { IError } from '@src/modules/base';

let isFirstLoad = true;

const Genres = () => {
  const dispatch = useDispatch();
  const genresDrawerRef: any = useRef(null);
  const flatListRef: any = useRef(null);
  const isShowGenresMenu = useSelector<RootState, boolean>((state: RootState) => state.book.isShowGenresMenu);
  const selectedItem = useSelector<RootState, IGenres | undefined>((state: RootState) => state.book.selectedGenres);
  const listGenres = useSelector<RootState, any[]>((state: RootState) => state.book.listGenres);
  //List book
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<boolean>(true);
  const listBook = useSelector<RootState, IPagination<IBook>>((state: RootState) => state.book.listBookGenres);

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    if (isShowGenresMenu == true) {
      getGenres();
      genresDrawerRef.current.openDrawer();
    }
  }, [isShowGenresMenu]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    getListBookWithGenres(page);
  }, [selectedItem]);

  useEffect(() => {
    if (listGenres.length == 0) {
      return;
    }
    const [first] = listGenres;
    if (first && !selectedItem) {
      actionSelectedGenres(first);
    }
  }, [listGenres]);

  useEffect(() => {
    if (isFirstLoad == true || !loading) {
      return;
    }
    getListBookWithGenres(page);
  }, [loading]);

  const onPressItem = (item: IBook) => {
    NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: item.id }, true);
  };

  const getGenres = () => {
    dispatch(
      actionGetGenres({
        onFail: (error: IError) => {
          NavigationActionsService.showErrorPopup(error);
        },
      }),
    );
  };

  const getListBookWithGenres = (page: number) => {
    isFirstLoad = false;
    dispatch(
      getList({
        mode: BookListModeEnum.Genres,
        genres_id: selectedItem?.id,
        page: page,
        limit: 18,
        onSuccess: () => {
          setPage(page + 1);
          if (page == 1 && scrollToTop) {
            flatListRef && flatListRef.current && flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
          }
          setTimeout(() => {
            setIsRefreshing(false);
            setLoading(false);
            setScrollToTop(false);
          }, 500);
        },
        onFail: error => {
          setTimeout(() => {
            setIsRefreshing(false);
            setLoading(false);
            setScrollToTop(false);
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onDrawChanged = (newState: DrawerState, isShow: boolean) => {
    if (isShow == false && newState == 'Settling') {
      dispatch(
        showGenresMenu({
          isShow: false,
        }),
      );
    }
  };

  const onTapOnGenres = (item: IGenres) => {
    genresDrawerRef.current.closeDrawer();
    actionSelectedGenres(item);
  };

  const actionSelectedGenres = (item: IGenres) => {
    setScrollToTop(true);
    setPage(1);
    dispatch(
      setSelectedGenres({
        genres: item,
      }),
    );
  };

  const onCloseDrawer = () => genresDrawerRef.current.closeDrawer();

  const renderItemGenres = (item: any, index: number) => {
    return (
      <View key={index}>
        <CustomTouchable style={styles.itemGenresContainer} onPress={onTapOnGenres.bind(undefined, item)}>
          <CustomText text={item.name} style={styles.textItemGenres} />
          {item.id == selectedItem?.id ? <View style={styles.markRed} /> : null}
        </CustomTouchable>
      </View>
    );
  };

  const renderContentDrawer = () => {
    return (
      <View style={styles.containerDrawer}>
        <View style={styles.containerList}>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.drawerContainer}>{listGenres.map(renderItemGenres)}</View>
          </ScrollView>
        </View>
        <TouchableWithoutFeedback onPress={onCloseDrawer}>
          <View style={styles.transView}></View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderListBook = () => (
    <FlatList
      ref={flatListRef}
      contentContainerStyle={styles.flatList}
      data={listBook.results}
      numColumns={3}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={renderRefreshControl()}
      ListEmptyComponent={<EmptyData />}
    />
  );

  const renderFooter = () => {
    return loading && listBook.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPage(1);
      getListBookWithGenres(1);
    }, 500);
  };

  const handleLoadMore = () => {
    if (!loading && listBook.next !== null && listBook.results.length !== listBook.count) {
      setLoading(true);
    }
  };

  const renderItem = ({ item }: { item: IBook }) => {
    return <BookItem url={item.image_thumb} title={item.name} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const keyExtractor = (item: IBook, index: number) => {
    return index.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <DrawerLayout
          drawerWidth={WIDTH_GENRES}
          drawerPosition={'left'}
          drawerType={'front'}
          renderNavigationView={renderContentDrawer}
          drawerLockMode="locked-closed"
          ref={genresDrawerRef}
          onDrawerStateChanged={onDrawChanged}
        >
          {renderListBook()}
        </DrawerLayout>
      </View>
    </View>
  );
};

export { Genres };
