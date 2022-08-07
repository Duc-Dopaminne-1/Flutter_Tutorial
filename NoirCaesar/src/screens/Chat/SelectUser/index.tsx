import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import Container from '@src/components/Container';
import NavigationActionsService from '@src/navigation/navigation';
import FastImage from 'react-native-fast-image';
import SEARCH_ICON from '@res/icons/searchSmall.png';
import CustomInput from '@src/components/CustomInput';
import styles from './styles';
import { colors } from '@src/constants/vars';
import ChatItem from '@src/components/Chat/ChatItem';
import { clone, get, throttle } from 'lodash';
import { DefaultAvatar } from '@src/components/DefaultAvatar';
import { CustomText } from '@src/components/CustomText';
import DELETE_USER_ICON from '@res/icons/delete_user.png';
import translate from '@src/localize';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, getFriendList, existOneOne, getChannelDetail, getParticipantList, removeMembers, addMembers } from '@src/modules/chat/channel/actions';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IUser, ChannelType, MessageType, IChannel, IParticipant, ChannelUserRole, ICreateChannel } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { ExistChannelResponse } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/channel';
import { MESSAGE } from '@src/constants/screenKeys';
import { IError } from '@src/modules/base';

interface Props {
  screenType: IScreenType;
  channelId?: string;
}

export interface Message {
  name: string;
  avatar: string;
}

export enum IScreenType {
  ADD_USER,
  MANAGE_USER,
}

interface IUIState {
  page: number;
  isRefreshing: boolean;
  loading: boolean;
}

const initialState: IUIState = {
  page: 1,
  isRefreshing: false,
  loading: false,
};

const SelectUserScreen = (props: Props) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');

  const [uiState, setUIState] = useState<IUIState>(initialState);
  const { page, isRefreshing, loading } = uiState;

  const me = useSelector<RootState, IUser>((state: RootState) => state.auth.userData!);
  const [channelDetail, setChannelDetail] = useState<IChannel | undefined>(undefined);
  const friendList = useSelector<RootState, IPagination<IUser>>(state => state.chatChannel.friendList);
  const participantList = useSelector<RootState, IPagination<IParticipant>>(state => state.chatChannel.participantList);
  const [listUserSelected, setListUserSelected] = useState<IUser[]>([]);
  const selectedFlatList = useRef<any>(null);
  const throttled = useRef<any>(
    throttle((text: string) => {
      // Handle search
      setUIState({
        ...uiState,
        page: 1,
        loading: true,
      });
    }, 1000),
  );

  const { screenType = IScreenType.ADD_USER, channelId } = props;

  useEffect(() => {
    if (channelId) {
      dispatch(getChannelDetail({
        id: channelId,
        onSuccess: (result: IChannel) => {
          setChannelDetail(result);
        }
      }));
    }
  }, []);

  useEffect(() => {
    throttled.current(searchText);
  }, [searchText]);

  useEffect(() => {
    if (loading) {
      if (screenType == IScreenType.ADD_USER) {
        dispatch(getFriendList({
          channelId,
          q: searchText,
          page: page,
          onSuccess: onGetListSuccess,
          onFail: onGetListFail,
        }));
      }
      else if (screenType == IScreenType.MANAGE_USER) {
        if (!channelId) return;
        dispatch(getParticipantList({
          channelId,
          q: searchText,
          page: page,
          onSuccess: onGetListSuccess,
          onFail: onGetListFail,
        }))
      }
    }
  }, [loading]);

  const onGetListSuccess = () => {
    setUIState({
      page: page + 1,
      isRefreshing: false,
      loading: false,
    });
  };

  const onGetListFail = (error?: IError) => {
    setUIState({
      ...uiState,
      isRefreshing: false,
      loading: false,
    });
  };

  const onPressBack = () => {
    NavigationActionsService.pop();
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const onRefresh = () => {
    setUIState({
      page: 1,
      isRefreshing: true,
      loading: true,
    });
  };

  const getGroupName = () => {
    const length = listUserSelected.length;
    let groupName = me.username;
    if (length <= 2) {
      listUserSelected.forEach((user: IUser) => {
        groupName += ', ' + user.display_name;
      });
      return groupName;
    }
    groupName = groupName + ', ' + listUserSelected[0].display_name + ' & ' + (length - 1) + ' others';
    return groupName;
  }

  const handleAddMember = (memberIds: string[]) => {
    NavigationActionsService.showLoading();
    if (!channelId) {
      NavigationActionsService.showCustomPopup({ text: translate("alert.message_error_default") });
      return;
    }
    dispatch(addMembers({
      channelId,
      memberIds,
      onSuccess: () => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.popToMessageChatScreen();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.showErrorPopup(error);
      },
    }))
  }

  const pushToMessageScreen = (passProps = {}) => {
    NavigationActionsService.push(MESSAGE, passProps, true);
  }

  const createChannelAndOpenChatScreen = (participant_ids: string[], channelType: ChannelType) => {
    NavigationActionsService.showLoading();
    dispatch(createChannel({
      data: {
        name: getGroupName() || "Noir Group",
        participant_ids,
        type: channelType,
        message: {
          type: MessageType.SYSTEM,
          content: `${me.username} has created a conversation`
        }
      },
      onSuccess: (result: ICreateChannel) => {
        NavigationActionsService.hideLoading();
        pushToMessageScreen({
          channelId: result.id,
          displayName: result.display_name,
          channelType: result.type
        });
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.showErrorPopup(error);
      },
    }))
  }

  const handleDonePress = () => {
    if (listUserSelected.length == 0) return;

    const participant_ids: string[] = clone(listUserSelected).map(item => item.user_id);
    const channelType = participant_ids.length > 1 ? ChannelType.GROUP : ChannelType.ONE_ONE;
    if (channelId) {
      // Case open SelectUser Screen from Group Settings
      handleAddMember(participant_ids);
      return;
    }

    // Case open SelectUser Screen from List Channel
    if (participant_ids.length > 1) {
      // Case create chat group
      createChannelAndOpenChatScreen([...participant_ids, me.user_id], channelType);
    }
    else {
      // Case create chat one-one
      dispatch(
        existOneOne({
          userId: participant_ids[0],
          onSuccess: (result: ExistChannelResponse) => {
            if (result.channel_id) {
              dispatch(
                getChannelDetail({
                  id: result.channel_id,
                  onSuccess: (result: IChannel) => {
                    if (result) {
                      pushToMessageScreen({
                        channelId: result.id,
                        displayName: result.display_name,
                      });
                    }
                  },
                  onFail: error => {
                    error && NavigationActionsService.showErrorPopup(error);
                  },
                }),
              );
            } else {
              pushToMessageScreen({ listUserSelected, channelType });
            }
          },
        }),
      );
    }
  };

  const handleRightButtonPress = (item: IUser) => {
    if (screenType == IScreenType.ADD_USER) {
      const newList = [...listUserSelected, item];
      setListUserSelected(newList);
      setTimeout(() => {
        selectedFlatList.current && selectedFlatList.current.scrollToEnd({ animated: true });
      }, 100);
    }
    else {
      NavigationActionsService.showCustomPopup({
        text: translate("chat_component.remove_member_warning"),
        buttonRedTitle: translate("common.yes"),
        buttonGrayTitle: translate("common.cancel"),
        onPressRedButton: () => {
          NavigationActionsService.hideCustomPopup();
          handleRemoveMember(item);
        }
      })
    }
  };

  const handleRemoveMember = (user: IUser) => {
    NavigationActionsService.showLoading();
    const { user_id } = user;
    if (!channelId) {
      NavigationActionsService.showCustomPopup({ text: translate("alert.message_error_default") });
      return;
    }
    dispatch(removeMembers({
      channelId,
      memberIds: [user_id],
      onSuccess: () => {
        NavigationActionsService.hideLoading();
        setUIState({
          ...uiState,
          page: 1,
          loading: true
        })
      },
      onFail: (error?: IError) => {
        NavigationActionsService.hideLoading();
        NavigationActionsService.showErrorPopup(error);
      }
    }))
  }

  const handleDeleteSelectedUser = (index: number) => {
    if (screenType == IScreenType.ADD_USER) {
      const newList = clone(listUserSelected);
      newList.splice(index, 1);
      setListUserSelected(newList);
    }
  };

  const handleLoadMore = () => {
    if (screenType == IScreenType.ADD_USER) {
      if (!loading && friendList.next !== null && friendList.results.length !== friendList.count) {
        setUIState({
          ...uiState,
          loading: true,
        });
      }
    } else {
      if (!loading && participantList.next !== null && participantList.results.length !== participantList.count) {
        setUIState({
          ...uiState,
          loading: true,
        });
      }
    }
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const renderHeader = () => {
    const newChatOrAddMember = channelId ? translate('chat_component.add_members') : translate('channel_list.new_chat');
    const middleText = screenType == IScreenType.ADD_USER ? newChatOrAddMember : translate('chat_component.manage_group_member');
    const rightText = screenType == IScreenType.ADD_USER ? translate('chat_component.done') : undefined;
    const rightAction = screenType == IScreenType.ADD_USER ? handleDonePress : undefined;

    return (
      <CustomHeader
        leftImage={BACK}
        title={middleText}
        leftAction={onPressBack}
        rightText={rightText}
        rightAction={rightAction}
      />
    );
  };

  const renderSearch = () => (
    <View style={styles.containerSearch}>
      <FastImage source={SEARCH_ICON} style={styles.iconNoItem} />
      <CustomInput
        onChangeText={onChangeText}
        placeholder={'Search by name'}
        returnKeyType="done"
        moreStyle={styles.search}
        value={searchText}
        inputStyle={styles.searchTextInputStyle}
        placeholderTextColor={'#0F0F13'}
      />
    </View>
  );

  const renderUserSelectedItem = ({ item, index }: { item: IUser; index: number }) => {
    const { avatar } = item;
    const name = get(item, ['display_name'], '');

    return (
      <View style={styles.avatarWrapper}>
        {avatar ? (
          <FastImage source={{ uri: avatar }} style={styles.avatar} />
        ) : (
            <DefaultAvatar name={name} textStyle={styles.avatarText} containerStyle={[styles.avatar, styles.avatarContainer]} />
          )}
        <CustomText numberOfLines={1} style={styles.userSelectedName} text={name} />
        <TouchableOpacity onPress={handleDeleteSelectedUser.bind(undefined, index)} style={{ position: 'absolute', right: 0, top: 0 }}>
          <FastImage source={DELETE_USER_ICON} style={styles.deleteUserIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderUserSelectedList = () => {
    if (listUserSelected.length == 0) {
      return null;
    }

    return (
      <FlatList
        ref={selectedFlatList}
        keyExtractor={(item: IUser, index: number) => `key-${index}`}
        horizontal={true}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={{ flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        data={listUserSelected}
        renderItem={renderUserSelectedItem}
      />
    );
  };

  const renderItem = ({ item, index }: { item: IUser; index: number }) => {
    const rightButtonText = screenType == IScreenType.ADD_USER ? 'Add' : 'Remove';
    const name = get(item, ['display_name'], '');

    let showRightButton = false;

    if (screenType == IScreenType.ADD_USER) {
      const isSelectUser =
        listUserSelected.filter((it: IUser) => {
          return it.display_name === name;
        }).length > 0;
      showRightButton = !isSelectUser;
    }
    else {
      if (channelDetail) {
        const adminId = get(channelDetail, ["admin", "user", "user_id"], "");
        if (me.user_id === adminId && me.user_id != item.user_id) {
          showRightButton = true;
        }
      }
    }

    return (
      <ChatItem
        key={item.user_id}
        title={name}
        avatar={item.avatar}
        showRightButton={showRightButton}
        rightButtonText={rightButtonText}
        onRightButtonPress={handleRightButtonPress.bind(undefined, item)}
      />
    );
  };

  const renderFooter = () => {
    if (loading && !isRefreshing) {
      const renderIndicator = () => (<ActivityIndicator color={colors.WHITE} />);
      if (screenType == IScreenType.ADD_USER) return friendList.next ? renderIndicator() : null;
      else return participantList.next ? renderIndicator() : null;
    }
    return null;
  };

  const mapList = () => {
    if (screenType == IScreenType.ADD_USER) {
      return friendList.results;
    }

    let result: IUser[] = [];
    participantList.results.forEach((participant: IParticipant) => {
      if (participant.user) {
        result = [...result, participant.user];
      }
    });
    return result;
  }

  const renderChatList = () => (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      data={mapList()}
      extraData={listUserSelected}
      renderItem={renderItem}
      refreshControl={renderRefreshControl()}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );

  return (
    <Container >
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'android' ? -500 : 0}>
        {renderHeader()}
        {renderSearch()}
        {renderUserSelectedList()}
        {renderChatList()}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SelectUserScreen;
