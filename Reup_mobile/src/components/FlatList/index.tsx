import { FlatList, StyleProp, ViewStyle, ListRenderItemInfo, View, RefreshControl, ActivityIndicator, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { usePrevious } from '@src/utils/hook';
import IMG_EMPTY from '@src/res/img/empty.png';
import { CustomText } from '../CustomText';
import translate from '@src/localize';
import { fonts, colors, WIDTH } from '@src/constants/vars';

interface Props<T> {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  onLoad: (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => void;
  numColumns?: number;
  initialPage?: number;
  style?: StyleProp<ViewStyle>;
  ItemSeparatorComponent: () => JSX.Element;
  contentContainerStyle?: StyleProp<ViewStyle>;
  emptyContainerStyle?: StyleProp<ViewStyle>;
  onEndReachedThreshold?: number;
  pullToRefresh?: boolean;
  loadMore?: boolean;
  hasNext?: boolean;
  indicatorColor?: string;
  horizontal?: boolean;
  scrollEnabled?: boolean;
  pagingEnabled?: boolean;
  listFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  columnWrapperStyle?: ViewStyle;
  listHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  showEmpty?: boolean;
}

const FlatListComponent = <T,>(props: Props<T>, ref: any) => {
  const {
    data,
    renderItem,
    onLoad,
    ItemSeparatorComponent,
    numColumns = 1,
    initialPage = 1,
    style,
    contentContainerStyle,
    emptyContainerStyle,
    onEndReachedThreshold = 0.5,
    pullToRefresh = false,
    loadMore = false,
    hasNext = false,
    indicatorColor = colors.GRAY500,
    horizontal = false,
    scrollEnabled = true,
    pagingEnabled = false,
    listFooterComponent = null,
    columnWrapperStyle,
    listHeaderComponent = null,
    showEmpty = true,
  } = props;

  const [page, setPage] = useState(initialPage);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const firstLoad = useRef<boolean>(true);
  const flatListRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    reloadData() {
      flatListRef && flatListRef.current && flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      setPage(initialPage);
      setTimeout(() => {
        fetchData();
      }, 200);
    },
    resetInitPage(page = 1) {
      setPage(page);
    },
    scrollToTop() {
      flatListRef && flatListRef.current && flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      firstLoad.current = false;
      onLoad(page, onLoadSuccess, onLoadFailure);
    }
  }, [loading]);

  const fetchData = () => {
    setLoading(true);
  };

  const onLoadSuccess = () => {
    setPage(page + 1);
    setIsRefreshing(false);
    setLoading(false);
  };

  const onLoadFailure = () => {
    setIsRefreshing(false);
    setLoading(false);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPage(initialPage);
      fetchData();
    }, 700);
  };

  const onLoadMore = () => {
    loadMore && !loading && hasNext && fetchData();
  };

  const renderFlatListItem = (data: ListRenderItemInfo<T>) => {
    const { item, index } = data;
    return renderItem(item, index);
  };

  const renderRefreshControl = () => {
    return pullToRefresh ?
      (
        <RefreshControl
          tintColor={indicatorColor}
          refreshing={isRefreshing}
          onRefresh={onRefresh} />
      ) : undefined;
  };

  const renderFooter = () => {
    return !firstLoad.current && loading && loadMore && hasNext ? <ActivityIndicator color={indicatorColor} /> : null;
  };

  const renderFlatList = () => {
    return (
      <FlatList
        ref={flatListRef}
        style={style}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={contentContainerStyle}
        data={data}
        pagingEnabled={pagingEnabled}
        keyExtractor={(_, index) => index.toString()}
        numColumns={numColumns}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderFlatListItem}
        refreshControl={renderRefreshControl()}
        ListFooterComponent={listFooterComponent ? listFooterComponent : renderFooter}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onLoadMore}
        horizontal={horizontal}
        scrollEnabled={scrollEnabled}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          showEmpty ?
            <View style={[styles.viewEmptyContainer, emptyContainerStyle]}>
              <Image source={IMG_EMPTY} resizeMode='contain' style={styles.imgEmpty} />
              <CustomText text={translate('empty_in_here')} style={styles.textEmpty} />
            </View> : null
        }
      />
    );
  };

  return <View style={{ flex: 1 }}>{renderFlatList()}</View>;
};

const styles = StyleSheet.create({
  viewEmptyContainer: {
    flex: 1,
    // width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  imgEmpty: {
    width: 80,
    height: 100,
  },
  textEmpty: {
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'center',
    color: 'grey',
    paddingBottom: 15
  }
});

type ForwardRefFn<R> = <P = {}>(p: P & React.RefAttributes<R>) => JSX.Element | null;

export const CustomFlatList = forwardRef(FlatListComponent) as ForwardRefFn<React.Component>;
