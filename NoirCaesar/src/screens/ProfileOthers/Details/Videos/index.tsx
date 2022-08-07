import styles from './styles';
import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import { colors } from '@src/constants/vars';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@src/hooks/usePrevious';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { IVideoModel } from '@src/models/media';
import { getListRetrieveCollection } from '@src/modules/user/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { VIDEO_DETAIL } from '@src/constants/screenKeys';

interface Props {
  user_id: string;
  bindFunctionRefreshVideo?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;
const Videos = (props: Props) => {
  const { user_id } = props;
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const listVideos = useSelector<RootState, IPagination<IVideoModel>>(state => {
    if (user_id && state.user[user_id]) {
      return state.user[user_id].listUserVideo;
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
    props.bindFunctionRefreshVideo && props.bindFunctionRefreshVideo(onRefreshVideos);
  }, []);

  const onRefreshVideos = () => {
    setPage(1);
    setLoading(true);
  };

  useEffect(() => {
    if (loading == true && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }
      getListVideo();
    }
  }, [loading]);

  const getListVideo = () => {
    dispatch(
      getListRetrieveCollection({
        user_id: props.user_id,
        type: CategoryCollectionEnum.Video,
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

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLoading(true);
      setPage(1);
    }, 500);
  };

  const onPressItem = (item: IVideoModel) => {
    NavigationActionsService.push(VIDEO_DETAIL, { story_id: item.id }, true);
  };

  const renderItem = ({ item }: { item: IVideoModel }) => {
    return (
      <BookItem
        url={item.image_thumb ? item.image_thumb : ''}
        title={item.name ? item.name : ''}
        onPressItem={onPressItem.bind(undefined, item)}
      />
    );
  };

  const keyExtractor = (item: any, index: number) => {
    return index.toString();
  };

  const renderFooter = () => {
    return loading && listVideos.results.length > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const handleLoadMore = () => {
    if (!loading && listVideos.next !== null && listVideos.results.length !== listVideos.count) {
      setLoading(true);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listVideos.results}
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

export { Videos };
