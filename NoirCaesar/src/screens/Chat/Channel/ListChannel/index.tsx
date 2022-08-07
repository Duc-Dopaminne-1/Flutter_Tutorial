import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IChannel } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { get, clone } from 'lodash';
import { MESSAGE } from '@src/constants/screenKeys';
import ChatItem from '@src/components/Chat/ChatItem';
import NavigationActionsService from '@src/navigation/navigation';
import EmptyData from '@src/components/EmptyData';
import styles from './styles';
import { colors } from '@src/constants/vars';
import { markReadChannel, saveUpdatedChannel } from '@src/modules/chat/channel/actions';

interface Props {
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const ListChannel = (props: Props) => {
  const dispatch = useDispatch();
  const { isRefreshing, loading, onRefresh, onLoadMore } = props;
  const channelList = useSelector<RootState, IPagination<IChannel>>(state => state.chatChannel.channelList);
  const data = get(channelList, ['results'], []);

  const onPressItem = (item: IChannel) => {
    NavigationActionsService.push(
      MESSAGE,
      {
        channelId: item.id,
        displayName: item.display_name || item.name,
        channelType: item.type
      },
      true,
    );

    dispatch(
      markReadChannel({
        channelId: item.id,
        onSuccess: () => {
          dispatch(
            saveUpdatedChannel({
              results: {
                ...item,
                badge: 0,
              },
            }),
          );
        },
      }),
    );
  };

  const onListRefresh = () => {
    if (!isRefreshing) {
      onRefresh();
    }
  };

  const onListLoadMore = () => {
    if (!loading && channelList.next !== null && channelList.results.length !== channelList.count) {
      onLoadMore();
    }
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onListRefresh} />;
  };

  const renderFooter = () => {
    return loading && !isRefreshing && channelList.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderItem = ({ item }: { item: IChannel }) => {
    const last_message = get(item, ['last_message'], undefined);
    const content = get(last_message, ['content'], '');
    const created = get(last_message, ['created'], '');
    const display_name = get(item, ['display_name'], '');
    const name = get(item, ['name'], '');
    const badge = get(item, ['badge'], '');

    return (
      <ChatItem
        key={item.id}
        title={display_name || name}
        isUnread={badge > 0}
        avatar={item.avatar}
        content={content}
        created={created.toString()}
        onPress={onPressItem.bind(undefined, item)}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={(item: IChannel) => item.id}
      data={data}
      renderItem={renderItem}
      refreshControl={renderRefreshControl()}
      ListFooterComponent={renderFooter()}
      onEndReached={onListLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<EmptyData />}
    />
  );
};
export default ListChannel;
