/* eslint-disable react-hooks/exhaustive-deps */
import {filter, findIndex, isEmpty, last} from 'lodash';
import React, {forwardRef, useEffect, useState} from 'react';
import {FlatList, FlatListProps, RefreshControl, StyleSheet, Text, ViewStyle} from 'react-native';

import {parseGraphqlError} from '../api/graphql/parseGraphqlError';
import {DEFAULT_PAGE_SIZE, EMPTY_STRING, EMPTY_TYPE, FETCH_POLICY} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {METRICS} from '../assets/theme/metric';
import {useMount} from '../screens/commonHooks';
import useDeepCompareEffect from '../utils/useDeepCompareEffect';
import {EmptyListView} from './List/EmptyListView';
import {SizeBox} from './SizeBox';

type ListProps<ItemT> = {
  containerStyle: ViewStyle,
  contentStyle: ViewStyle,
  items: ReadonlyArray<ItemT>,
  onScroll: Function,
  renderItem: Function,
  actions: {
    refresh: Function,
    fetchMore: Function,
    updateItem: Function,
    selectItem: Function,
    unSelectItem: Function,
    removeItem: Function,
    updateItems: Function,
  },
  emptyType: String,
  onLoadMore: Function,
  loading: Boolean,
  onRefresh: Function,
  totalCount: Number,
  separatorHeight: Number,
  visibleEmpty: Boolean,
  error: String,
  otherProps: FlatListProps,
};

export const PAGING_TYPE = {
  OFFSET: 'OFFSET',
  CURSOR: 'CURSOR',
  OFFSET_VARIABLES: 'OFFSET_VARIABLES',
  CURSOR2: 'CURSOR2',
};

export const REFRESH_TYPE = {
  DELETE: 'delete',
  MASK_AS_READ: 'maskAsRead',
};

const QUERY_OPTIONS = {
  ...FETCH_POLICY.NETWORK_ONLY,
  notifyOnNetworkStatusChange: true,
};

const FIRST_PAGE = 1;

const SELECTION_MODE = {
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE',
};

const QUERY_STATE = {
  REFRESH: 'REFRESH',
  REFRESH_COMPLETED: 'REFRESH_COMPLETED',
  LOAD_MORE: 'LOAD_MORE',
  LOAD_MORE_COMPLETED: 'LOAD_MORE_COMPLETED',
};

const appendItems = (items, itemMapper) => {
  const list = [];
  for (let i = 0; i < items.length; i++) {
    list.push({
      ...(itemMapper ? itemMapper(items[i]) : items[i]),
    });
  }
  return list;
};

export const updateSingleItem = (updatedItem, arr, uniqueKey) => {
  const items = [...arr];
  const foundIndex = findIndex(items, item => item[uniqueKey] === updatedItem[uniqueKey]);
  if (foundIndex !== -1) {
    items[foundIndex] = {...items[foundIndex], ...updatedItem};
  }
  return items;
};

export const updateAllElements = (newItems, arr, uniqueKey) => {
  const items = [...arr];
  if (Array.isArray(newItems) && newItems.length > 0) {
    const updateItems = [...newItems];
    updateItems.map(updatedItem => {
      const foundIndex = findIndex(items, item => item[uniqueKey] === updatedItem[uniqueKey]);
      if (foundIndex !== -1) {
        items[foundIndex] = {...items[foundIndex], additionData: updatedItem};
      }
    });
  }
  return items;
};

const defaultExecuteRefresh = ({queryOptions, pageInfo: currentPageInfo, execute}) => {
  if (currentPageInfo.pagingType === PAGING_TYPE.CURSOR2) {
    execute({
      variables: {
        ...queryOptions.variables,
        after: EMPTY_STRING,
      },
    });
    return;
  }
  if (currentPageInfo.pagingType === PAGING_TYPE.CURSOR) {
    execute({
      variables: {
        pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
        ...queryOptions.variables,
        cursor: EMPTY_STRING,
      },
    });
  } else if (currentPageInfo.pagingType === PAGING_TYPE.OFFSET_VARIABLES) {
    execute({
      variables: {
        pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
        ...queryOptions.variables,
        page: FIRST_PAGE,
      },
    });
  } else {
    execute({
      variables: {
        input: {
          pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
          ...queryOptions.variables.input,
          page: FIRST_PAGE,
        },
      },
    });
  }
};

const defaultExecuteFetchMore = ({queryOptions, pageInfo: currentPageInfo, execute}) => {
  if (currentPageInfo.pagingType === PAGING_TYPE.CURSOR2) {
    execute({
      variables: {
        ...queryOptions.variables,
        after: currentPageInfo.cursor,
      },
    });
    return;
  }
  if (currentPageInfo.pagingType === PAGING_TYPE.CURSOR) {
    execute({
      variables: {
        pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
        ...queryOptions.variables,
        cursor: currentPageInfo.cursor,
      },
    });
  } else if (currentPageInfo.pagingType === PAGING_TYPE.OFFSET_VARIABLES) {
    execute({
      variables: {
        pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
        ...queryOptions.variables,
        page: currentPageInfo.currentPage + 1,
      },
    });
  } else {
    execute({
      variables: {
        input: {
          pageSize: queryOptions?.pageSize ?? DEFAULT_PAGE_SIZE,
          ...queryOptions.variables.input,
          page: currentPageInfo.currentPage + 1,
        },
      },
    });
  }
};

const useDefaultQueryWrapper = props => {
  const {useQuery, queryOptions, extractArray, refreshData, mapUpdatedItems, updatedItemIds} =
    props;
  const {mapToUiModel, extractTotalCount, onCompleted} = props;
  const {uniqueKey, updateData, updateKey, replaceDataWhenRefresh} = props;
  const {executeRefresh, executeFetchMore, shouldRefresh} = props;
  const {pagingType = PAGING_TYPE.CURSOR, selectionMode = SELECTION_MODE.SINGLE} = props;
  const [execute, {data, error: queryError}] = useQuery(QUERY_OPTIONS);
  const [items, setItems] = useState([]);
  const [currentQueryState, setCurrentQueryState] = useState(QUERY_STATE.REFRESH);
  const [pageInfo, setPageInfo] = useState({
    pagingType,
    cursor: EMPTY_STRING,
    currentPage: FIRST_PAGE,
  });
  const [error, setError] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState(false);
  const [selectedArr] = useState(new Set());
  const [totalCount, setTotalCount] = useState(0);

  const handleCompleted = newItems => {
    setLoading(false);
    onCompleted && onCompleted(newItems);
  };

  useEffect(() => {
    if (updatedItemIds && updatedItemIds?.length > 0) {
      const newItems = mapUpdatedItems(items);
      setItems(newItems);
    }
  }, [updatedItemIds]);

  function refresh() {
    setCurrentQueryState(QUERY_STATE.REFRESH);
    setError(EMPTY_STRING);
    setLoading(true);
    executeRefresh ? executeRefresh() : defaultExecuteRefresh({queryOptions, pageInfo, execute});
  }

  function fetchMore() {
    setCurrentQueryState(QUERY_STATE.LOAD_MORE);
    setError(EMPTY_STRING);
    setLoading(true);
    executeFetchMore
      ? executeFetchMore()
      : defaultExecuteFetchMore({queryOptions, pageInfo, execute});
  }

  const updateItem = updatedItem => setItems([...updateSingleItem(updatedItem, items, uniqueKey)]);

  const updateItems = newItems => setItems([...updateAllElements(newItems, items, updateKey)]);

  const removeItem = (removedItem, removedItemId) => {
    const remainItems = filter(
      items,
      it => it[uniqueKey] !== removedItemId ?? removedItem[uniqueKey],
    );
    setItems([...remainItems]);
    if (remainItems.length < items.length) {
      setTotalCount(totalCount - 1);
    }
  };

  const selectItem = selectedItem => {
    if (selectionMode === SELECTION_MODE.SINGLE && selectedArr.size > 0) {
      return;
    }
    selectedArr.add(selectedItem[uniqueKey]);
    setItems([...items]);
  };

  const unSelectItem = unSelectedItem => {
    selectedArr.delete(unSelectedItem[uniqueKey]) && setItems([...items]);
  };

  useMount(refresh);

  useDeepCompareEffect(() => {
    refresh();
  }, [queryOptions, shouldRefresh]);

  useEffect(() => {
    if (updateData) {
      updateItems(updateData);
    }
  }, [updateData]);

  useEffect(() => {
    if (data) {
      const errorMessage = data.errorMessage || data.errorCode || data.errorMessageCode;
      if (errorMessage) {
        setError(errorMessage);
        handleCompleted();
        return;
      }

      const rawItems = extractArray(data);
      const total = extractTotalCount && extractTotalCount(data);
      setTotalCount(total);

      if (isEmpty(rawItems)) {
        if (currentQueryState === QUERY_STATE.REFRESH) {
          setItems([]);
        }
        handleCompleted();
        return;
      }

      (async () => {
        const lastCursor = last(rawItems).cursor ?? EMPTY_STRING;
        const temps = appendItems(rawItems, mapToUiModel);
        if (currentQueryState === QUERY_STATE.LOAD_MORE) {
          const newItems = [...items, ...temps];
          setItems(newItems);
          setPageInfo({...pageInfo, currentPage: pageInfo.currentPage + 1, cursor: lastCursor});
        } else {
          let newItems = [...temps];
          if (replaceDataWhenRefresh) {
            newItems = await replaceDataWhenRefresh(newItems);
          }
          setItems(newItems);
          setPageInfo({...pageInfo, currentPage: FIRST_PAGE, cursor: lastCursor});
        }
        handleCompleted(temps);
      })();
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      const errorMessage = parseGraphqlError(queryError);
      setError(errorMessage);
      handleCompleted();
    }
  }, [queryError]);

  useEffect(() => {
    if (refreshData?.id) {
      const dataTemp = [...items];
      const index = dataTemp.findIndex(item => item.id === refreshData.id);
      if (index >= 0) {
        if (refreshData?.type === REFRESH_TYPE.DELETE) {
          dataTemp.splice(index, 1);
        } else {
          dataTemp[index].isUnread = false;
        }
      }
      setItems(dataTemp);
    }
  }, [refreshData?.id, refreshData?.type]);

  const actions = {
    refresh,
    fetchMore,
    updateItem,
    selectItem,
    unSelectItem,
    removeItem,
    updateItems,
  };
  const allData = {items, totalCount, loading, error, selectedArr};
  return [actions, allData];
};

export type LazyListProps = {
  onQueryCompleted: (newItems: Array) => {},
  onDataChange: ({items: Array, totalCount: Number}) => {},
};

const Loading = ({length, totalCount}) => {
  return length < totalCount ? (
    <>
      <Text style={styles.loadingStyle}>{translate(STRINGS.LOADING_MORE)}</Text>
    </>
  ) : null;
};

const useLazyList = ({
  onDataChange,
  onQueryCompleted,
  useQueryWrapper = useDefaultQueryWrapper,
  scrollToY,
  emptyType,
  removedItemId,
  visibleEmpty,
  ref,
  ...otherProps
}) => {
  const [actions, {items, totalCount, loading, error}] = useQueryWrapper({
    ...otherProps,
    onCompleted: onCompleted,
  });

  const {contentStyle, containerStyle, onScroll} = otherProps;

  function onCompleted(newItems) {
    onQueryCompleted && onQueryCompleted(newItems);
  }

  const onRefresh = () => {
    actions.refresh();
  };

  const onLoadMore = () => {
    if (items.length === totalCount) {
      return;
    }
    actions.fetchMore();
  };

  const scrollTo = () => {
    if (scrollToY) {
      ref.current?.scrollTo({y: scrollToY, x: 0}, false);
    }
  };

  useEffect(scrollTo, [scrollToY]);

  useEffect(() => {
    if (totalCount > 0) {
      onDataChange && onDataChange({totalCount, items});
    }
  }, [totalCount, items]);

  useEffect(() => {
    if (removedItemId) {
      actions.removeItem(null, removedItemId);
    }
  }, [removedItemId]);

  const props = {
    containerStyle,
    contentStyle,
    items,
    ref,
    onScroll,
    actions,
    onLoadMore,
    loading,
    onRefresh,
    emptyType,
    totalCount,
    error,
    visibleEmpty,
    ...otherProps,
  };

  return props;
};

const LazyList = (
  {
    renderItem,
    emptyType = EMPTY_TYPE.DEFAULT,
    onDataChange,
    onQueryCompleted,
    useQueryWrapper = useDefaultQueryWrapper,
    scrollToY,
    removedItemId,
    visibleEmpty = true,
    ...otherProps
  }: ListProps & LazyListProps,
  ref,
) => {
  const props = useLazyList({
    ref: ref,
    renderItem: renderItem,
    emptyType: emptyType,
    onDataChange: onDataChange,
    onQueryCompleted: onQueryCompleted,
    useQueryWrapper: useQueryWrapper,
    scrollToY: scrollToY,
    removedItemId: removedItemId,
    visibleEmpty,
    ...otherProps,
  });
  return <LazyListView {...props} />;
};

export const LazyListView = ({
  containerStyle,
  contentStyle,
  items,
  ref,
  onScroll,
  renderItem,
  actions,
  emptyType,
  onLoadMore,
  loading,
  onRefresh,
  totalCount,
  separatorHeight = SIZES.SEPARATOR_16,
  visibleEmpty,
  error,
  ...otherProps
}: ListProps) => {
  return (
    <FlatList
      style={containerStyle}
      contentContainerStyle={[styles.contentStyle, contentStyle]}
      data={items}
      ref={ref}
      ListEmptyComponent={() =>
        visibleEmpty && (
          <EmptyListView
            loading={loading}
            onPressSeeAgentList={otherProps?.onPressSeeAgentList}
            type={emptyType}
            error={error}
            containerStyle={otherProps?.emptyContainerStyle}
          />
        )
      }
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={5}
      windowSize={200}
      onScroll={onScroll}
      ItemSeparatorComponent={() => <SizeBox height={separatorHeight} />}
      removeClippedSubviews={true}
      renderItem={({index}) => renderItem({index, item: items[index], actions})}
      onEndReached={onLoadMore}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      ListFooterComponent={() => <Loading length={items?.length} totalCount={totalCount} />}
      {...otherProps}
    />
  );
};

export default forwardRef(LazyList);

const styles = StyleSheet.create({
  contentStyle: {
    flexGrow: 1,
    paddingVertical: SIZES.PADDING_16,
    ...METRICS.horizontalMargin,
  },
  loadingStyle: {
    textAlign: 'center',
    color: COLORS.TEXT_DARK_10,
    ...FONTS.regular,
    marginTop: SIZES.SEPARATOR_16,
  },
});
