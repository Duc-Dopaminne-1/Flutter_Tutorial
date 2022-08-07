import React, { ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ChatListChanelItem from '@/screens/Message/ListChanel/component/ChatListChanelItem';
import { getListRoomHistory } from '@/redux/messages/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CHAT_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { EmptyMessage } from '@/screens/Message/component/EmptyMessage';
import { useSelector } from 'react-redux';
import { MessageInit } from '@/redux/messages/reducer';
import { colors } from '@/vars';

let onEndReachedCalledDuringMomentum = true;

export function ChatListChanelHistory(): ReactElement {
  const rooms = useSelector((state: MessageInit) => state.message.roomsHistory);
  const [loading, setLoading] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  useEffect(() => {
    NavigationActionsService.dispatchAction(getListRoomHistory({}));
  }, []);

  const onPressRoom = (roomId: string, name: string) => {
    NavigationActionsService.push(CHAT_DETAIL_SCREEN, {
      roomId,
      name,
      isFromHistory: true,
    });
  };

  const renderItem = ({ item }) => {
    return <ChatListChanelItem item={item} unread={item.unread} onPress={onPressRoom} />;
  };

  const keyExtractor = item => item.id.toString();

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      NavigationActionsService.dispatchAction(getListRoomHistory({}));
      setLoading(false);
    }, 1000);
  };

  const renderEmpty = () => {
    return <EmptyMessage />;
  };

  const handleLoadMore = async () => {
    if (!isLoadingBottom && !onEndReachedCalledDuringMomentum) {
      onEndReachedCalledDuringMomentum = true;
      setIsLoadingBottom(true);
      // load more
      NavigationActionsService.dispatchAction(
        getListRoomHistory({
          isLoadMore: true,
          offset: rooms[rooms.length - 1].lastMessage.createdAt,
          onSuccess: _data => {
            setIsLoadingBottom(false);
          },
          onFail: _err => {
            setIsLoadingBottom(false);
          },
        }),
      );
    }
  };

  const renderFooter = () => {
    if (!isLoadingBottom) return null;
    return <ActivityIndicator color={colors.gray_500} style={styles.loading} />;
  };

  return (
    <View style={styles.container}>
      {rooms.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={rooms}
          style={styles.wrapList}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
  },
  wrapList: {
    opacity: 0.5,
  },
  loading: {
    paddingVertical: 50,
    color: colors.gray_500,
  },
});
