import React, { ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ChatListChanelItem from '@/screens/Message/ListChanel/component/ChatListChanelItem';
import { useSelector } from 'react-redux';
import { getListRoom } from '@/redux/messages/actions';
import { MessageInit } from '@/redux/messages/reducer';
import NavigationActionsService from '@/navigation/navigation';
import { CHAT_DETAIL_SCREEN } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/core';
import { EmptyMessage } from '@/screens/Message/component/EmptyMessage';
import { CustomSwipeAble } from '@/components/CustomSwipe';
import { SocketManager } from '@/shared/socket/socket-manager';
import { language } from '@/i18n';
import CustomConfirmModal from '@/components/CustomModal';
import { colors } from '@/vars';

let rows = {};
let productIdCloseSwipe = '';
let deleteRoomId = '';
let onEndReachedCalledDuringMomentum = true;

export function ChatListChanel(): ReactElement {
  const rooms = useSelector((state: MessageInit) => state.message.rooms);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (rooms.length === 0) {
        NavigationActionsService.dispatchAction(getListRoom({}));
      } else {
        rooms.sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      }
    });
    return unsubscribe;
  }, [navigation, rooms]);

  const onPressRoom = (roomId: string, name: string) => {
    NavigationActionsService.push(CHAT_DETAIL_SCREEN, {
      roomId,
      name: name || 'undefined',
    });
  };

  const resetDataLocal = () => {
    productIdCloseSwipe = '';
  };

  const onPressClose = () => {
    resetDataLocal();
  };

  const onConfirmPress = () => {
    setModalVisible(false);
    SocketManager.instanceChat.deleteRoom(deleteRoomId);
    deleteRoomId = '';
  };

  const onPressDelete = (id: string) => {
    if (rows[productIdCloseSwipe]) {
      rows[productIdCloseSwipe].close();
    }
    deleteRoomId = id;
    setModalVisible(true);
    onPressClose();
  };

  const swipeRightOpen = (id: string) => {
    if (productIdCloseSwipe !== '' && productIdCloseSwipe !== id) {
      if (rows[productIdCloseSwipe]) {
        rows[productIdCloseSwipe].close();
      }
    }
    productIdCloseSwipe = id;
  };

  const renderItem = ({ item }) => {
    const { id } = item;
    return (
      <CustomSwipeAble
        _productSwipeRef={row => (rows[id] = row)}
        product={item}
        onPressDelete={() => onPressDelete(id)}
        swipeRightOpen={() => swipeRightOpen(id)}
      >
        <ChatListChanelItem item={item} unread={item.unread} onPress={onPressRoom} />
      </CustomSwipeAble>
    );
  };

  const keyExtractor = item => item.id.toString();

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      NavigationActionsService.dispatchAction(getListRoom({}));
      setLoading(false);
    }, 1000);
  };

  const onBackdropPress = () => {
    setModalVisible(false);
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
        getListRoom({
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
      <CustomConfirmModal
        isVisible={modalVisible}
        title={language('deleteRoom')}
        textBtnConfirm={language('delete')}
        onBackdropPress={onBackdropPress}
        onConfirmPress={onConfirmPress}
      />
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
  loading: {
    paddingVertical: 50,
    color: colors.gray_500,
  },
});
