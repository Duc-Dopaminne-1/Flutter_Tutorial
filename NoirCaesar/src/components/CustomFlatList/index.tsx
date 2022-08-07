import { FlatList, StyleProp, ViewStyle, ListRenderItemInfo, View, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, ReactElement } from 'react';
import translate from '@src/localize';
import { CustomText } from '../CustomText';
import { colors } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';

interface Props<T> {
  data: T[];
  extraData?: any;
  inverted?: boolean;
  renderItem: (item: T, index?: number) => JSX.Element;
  renderHeader?: () => JSX.Element;
  renderEmptyComponent?: () => JSX.Element;
  onLoad: (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => void;
  numColumns?: number;
  initialPage?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerStyle?: ViewStyle;
  onEndReachedThreshold?: number;
  pullToRefresh?: boolean;
  loadMore?: boolean;
  indicatorColor?: string;
}

const FlatListComponent = <T,>(props: Props<T>, ref: any) => {
  const {
    data,
    extraData,
    inverted = false,
    renderItem,
    renderHeader,
    renderEmptyComponent,
    onLoad,
    numColumns = 1,
    initialPage = 1,
    style,
    contentContainerStyle,
    headerStyle,
    onEndReachedThreshold = 0.5,
    pullToRefresh = false,
    loadMore = false,
    indicatorColor = colors.DARK_GREY,
  } = props;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const firstLoad = useRef<boolean>(true);
  const page = useRef<number>(initialPage);

  const fetchData = () => {
    setLoading(true);
  };

  useImperativeHandle(ref, () => ({
    reloadData() {
      page.current = initialPage;
      fetchData();
    },
  }));

  const onLoadSuccess = () => {
    page.current = page.current + 1;
    setIsRefreshing(false);
    setLoading(false);
  };

  const onLoadFailure = () => {
    setIsRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    !loading && fetchData();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      firstLoad.current = false;
      onLoad(page.current, onLoadSuccess, onLoadFailure);
    }
  }, [loading]);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      page.current = initialPage;
      fetchData();
    }, 500);
  };

  const onLoadMore = () => {
    loadMore && !loading && fetchData();
  };

  const renderFlatListItem = (data: ListRenderItemInfo<T>) => {
    const { item, index } = data;
    return renderItem(item, index);
  };

  const renderRefreshControl = () => {
    return pullToRefresh ? <RefreshControl tintColor={indicatorColor} refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined;
  };

  const renderFooter = () => {
    return !firstLoad.current && loading && loadMore ? <ActivityIndicator color={indicatorColor} /> : null;
  };

  const renderEmptyList = () => {
    return renderEmptyComponent ? (
      renderEmptyComponent()
    ) : (
      <CustomText style={{ transform: [{ scaleY: inverted ? -1 : 1 }] }} text={translate('common.list_empty')} />
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        style={style}
        contentContainerStyle={contentContainerStyle}
        data={data}
        extraData={extraData}
        inverted={inverted}
        keyExtractor={(_, index) => index.toString()}
        numColumns={numColumns}
        renderItem={renderFlatListItem}
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={headerStyle}
        refreshControl={renderRefreshControl()}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={onEndReachedThreshold}
        onEndReached={onLoadMore}
      />
    );
  };

  return <View style={{ flex: 1 }}>{renderFlatList()}</View>;
};

type ForwardRefFn<R> = <P = {}>(p: P & React.RefAttributes<R>) => ReactElement | null;
export const CustomFlatList = forwardRef(FlatListComponent) as ForwardRefFn<React.Component>;
