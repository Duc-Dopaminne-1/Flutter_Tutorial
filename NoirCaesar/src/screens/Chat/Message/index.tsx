import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK, CHAT_SETTINGS } from '@src/constants/icons';
import moment from 'moment';
import { MessageItem, MessageItemProps, GroupProps } from '@src/components/Chat/MessageItem';
import { AddNewMessageForm } from '@src/components/Chat/AddNewMessageForm';
import DocumentPickerImage from '@src/components/DocumentPickerImage';
import { useDispatch, useSelector } from 'react-redux';
import translate from '@src/localize';
//@ts-ignore
import SoundRecorder from 'react-native-sound-recorder';
import TrackPlayer from 'react-native-track-player';
import { IUploadFile, IURL } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/models';
import { Image } from 'react-native-image-crop-picker';
import { clone } from 'lodash';
import DocumentPicker from 'react-native-document-picker';
import { VIDEO_MEDIA_PLAYER, IMAGE_VIEWER, GROUP_SETTINGS, PROFILE_OTHERS } from '@src/constants/screenKeys';
import { IError } from '@src/modules/base';
import EmptyData from '@src/components/EmptyData';
import {
  IChannelMessage,
  IChannel,
  MessageType,
  IUser,
  ChannelType,
  ICreateChannel,
} from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { RootState } from '@src/types/types';
import { usePrevious } from '@src/hooks/usePrevious';
import { getMessageList, sendMessage } from '@src/modules/chat/message/actions';
import { colors } from '@src/constants/vars';
import { IUser as ICurrentUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { useUpload } from '@src/hooks/uploadMedias';
import { createChannel } from '@src/modules/chat/channel/actions';
import { uploadCollection } from '@src/modules/auth/actions';
import NotificationsService from '@src/modules/notifications/service';
import { requestRecordAudioPermission } from '@src/utils/permissions';
// @ts-ignore
import { transcode } from 'react-native-audio-transcoder';
import uuid from 'uuid';
import { getProfileDetail } from '@src/modules/user/actions';
import { SocketService } from '@src/modules/chat/socket/service';
import { MimeType } from '@src/components/DocumentPicker';

interface Props {
  isFromChannel?: boolean;
  item?: IChannel;
  channelId?: string;
  channelType?: ChannelType;
  listUserSelected?: IUser[];
  displayName?: string;
  groupName?: string;
}

let tempImage: any[] = [];
let listener: any;
interface ImageUpload {
  progress: number;
  sourceURL: string;
}

interface IMessage {
  message: IChannelMessage;
  isPause: boolean;
}
let tempMessageList: any[] = [];

const Message = (props: Props) => {
  const dispatch = useDispatch();
  const { isFromChannel = true, channelId, channelType, listUserSelected, displayName, groupName } = props;
  const isChatGroup = channelType == ChannelType.GROUP;
  const [idChannel, setIdChannel] = useState<string | undefined>(channelId);
  const flatListRef = useRef<any>(null);
  const documentRef = useRef<any>(null);
  const messageList = useSelector<RootState, IPagination<IChannelMessage>>(state => {
    if (idChannel && state.chatMessage[idChannel]) {
      return state.chatMessage[idChannel].messageList;
    } else {
      return {
        count: 0,
        next: '',
        previous: '',
        results: [],
      };
    }
  });
  const currentUser = useSelector<RootState, ICurrentUser>(state => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const [page, setPage] = useState(1);
  const [currentId, setCurrentId] = useState('');
  const [imagesPicker, setImagesPicker] = useState<(Image & ImageUpload & { type: any })[]>([]);
  const [data, setData] = useState<IMessage[]>([]);
  const [upload] = useUpload();

  useEffect(() => {
    getListMessage();

    setupTrackPlayer();

    registerAppStateChangeListener();

    SocketService.getInstance().registerCallbackMemberRemoved(() => {
      showLeftGroupPopup();
    });

    return () => {
      tempImage = [];
      tempMessageList = [];
      listener && listener.remove();
      TrackPlayer.reset();
      NotificationsService.getInstance().setCurrentChannelId('');
      removeAppStateChangeListener();
      SocketService.getInstance().unregisterCallBackMemberRemoved();
    };
  }, []);

  useEffect(() => {
    if (idChannel) {
      NotificationsService.getInstance().setCurrentChannelId(idChannel);
    }
  }, [idChannel]);

  useEffect(() => {
    if (messageList.results.length > 0) {
      const cloneArray: IMessage[] = clone(messageList.results).map(item => ({
        message: item,
        isPause: true,
      }));
      setData(cloneArray);
    }
  }, [messageList]);

  const doGetMessageList = (page: number) => {
    if (!idChannel) return;
    dispatch(
      getMessageList({
        channelId: idChannel,
        page: page,
        onSuccess: () => {
          setPage(page + 1);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
        onFail: error => {
          if (error) {
            if (error.code == 6005) {
              // User have been removed
              showLeftGroupPopup();
              return;
            }
            setTimeout(() => {
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          }
        },
      }),
    );
  }

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      doGetMessageList(page);
    }
  }, [loading]);

  const showLeftGroupPopup = () => {
    NavigationActionsService.showCustomPopup({
      text: "You have been removed from this group",
      buttonRedTitle: "OK",
      onPressRedButton: () => {
        NavigationActionsService.hideCustomPopup();
        NavigationActionsService.dismissAllModal();
        onPressBack();
      }
    });
  }

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setTimeout(() => {
        doGetMessageList(1);
      }, 300);
    }
  }

  const registerAppStateChangeListener = () => {
    AppState.addEventListener('change', handleAppStateChange);
  }

  const removeAppStateChangeListener = () => {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  const getListMessage = () => {
    setLoading(true);
  };

  /*IMAGE & VIDEO handle action */
  const onCompletedPicker = (imageResponse: any, type: any) => {
    if (imageResponse) {
      const isImage = type === DocumentPicker.types.images;
      if (isImage) tempImage = imageResponse;
      else tempImage = [imageResponse]; // Case video

      if (tempImage.length > 20) {
        NavigationActionsService.showCustomPopup({
          showLogo: false,
          text: `Can't process more than 20 pics in a message.`
        });
        tempImage = [];
        return;
      }

      tempImage.map((images: any, index: number) => {
        uploadImage(images, index, type);
      });
    }
  };

  const uploadImage = (imageResponse: any, index: any, type: any) => {
    upload({
      imageResponse,
      index,
      type,
      success: onUploadSuccess,
      failure: onUploadFailure,
      progress: onUploadProgress,
    });
  };

  const onUploadSuccess = (data: IUploadFile, type: any, index: any) => {
    const imagesPickerClone = tempImage.map((img, i) => {
      const cloneObj = {
        sourceURL: data.file_path,
        progress: 1,
        type: type === DocumentPicker.types.video ? 'video' : 'image',
      };

      return index == i ? { ...img, ...cloneObj } : { ...img };
    });

    tempImage = imagesPickerClone;
    setImagesPicker(imagesPickerClone);

    setTimeout(() => {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }, 100);
  };

  const onUploadFailure = (error?: IError) => {
    setTimeout(() => {
      error &&
        Alert.alert(translate('alert.title_error'), error.message, [
          {
            text: translate('alert.ok'),
            onPress: () => {
              tempImage = [];
              setImagesPicker([]);
            },
          },
        ]);
    }, 500);
  };

  const onUploadProgress = (index: number, percent: number) => {
    const imagesPickerClone = tempImage.map((img, id) => {
      if (index === id) {
        return {
          ...img,
          progress: percent / 100,
        };
      }
      return img;
    });
    if (percent < 100) {
      tempImage = imagesPickerClone;
      setImagesPicker(imagesPickerClone);
    }
  };

  const onShowImageViewer = (uris: string[], index: number) => {
    const images = uris.map(item => {
      return {
        url: item,
      };
    });
    NavigationActionsService.showModal(IMAGE_VIEWER, { images, index });
  };

  const onPressVideo = (uri: string[], index: number) => {
    NavigationActionsService.showModal(VIDEO_MEDIA_PLAYER, { url: uri[0], isFromChat: true });
  };

  /*  AUDIO handle action */
  const setupTrackPlayer = () => {
    TrackPlayer.stop();
    TrackPlayer.reset();

    TrackPlayer.updateOptions({
      stopWithApp: true,
      playIcon: true,
      pauseIcon: true,
      capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
      compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
      notificationCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
    });
    TrackPlayer.setupPlayer();
    listener = TrackPlayer.addEventListener('playback-queue-ended', async () => {
      onPressPause();
    });
  };

  const onPressPlay = async (recordUri: string, id: string) => {
    TrackPlayer.stop();
    TrackPlayer.reset();
    const cloneArray: IMessage[] = clone(messageList.results).map(item => ({
      message: item,
      isPause: !(item.id == id && item.type == MessageType.RECORD),
    }));
    setData(cloneArray);
    setCurrentId(id);
    TrackPlayer.add([
      {
        id: Math.floor(Math.random() * 100) + 1 + '',
        url: recordUri ?? '',
        title: '',
        artist: '',
      },
    ]);
    TrackPlayer.play();
  };
  useEffect(() => {
    tempMessageList = messageList.results ?? [];
  }, [messageList]);

  const onPressPause = () => {
    const cloneArray: IMessage[] = clone(tempMessageList).map(item => ({
      message: item,
      isPause: true,
    }));
    setData(cloneArray);
  };

  const _onPressOut = () => {
    SoundRecorder.stop().then(async (result: any) => {
      const myFilePath = `file://${result.path}`;
      let myNewpath = myFilePath.replace('aac', 'mp3');
      if (Platform.OS == 'ios') {
      } else {
        try {
          await transcode(myFilePath, myNewpath);
        } catch (err) {
          console.error(err);
        }
      }
      const uri = Platform.OS == 'ios' ? myFilePath : myNewpath;
      if (result.duration >= 1000) {
        NavigationActionsService.showLoading();
        const file = {
          uri: uri,
          type: 'audio/mp3',
          name: `${moment().format('YYYY-MM-DD-hh-mm-ss')}.mp3`,
        };
        const presignedPost = {
          file_name: `${moment().format('YYYY-MM-DD-hh-mm-ss')}.mp3`,
          file_type: MimeType.audio,
          folder_name: 'record',
          is_public: true,
          file_size: null,
          duration: result.duration / 1000,
        };

        dispatch(
          uploadCollection({
            file,
            presignedPost,
            onSuccess: (data: IURL) => {
              if (idChannel) {
                actionSendMediaMessage(idChannel, MessageType.RECORD, [data.file_path]);
              } else {
                const listUser = listUserSelected || [];
                const participantIds = clone(listUser).map(item => item.user_id);
                const channelName = isChatGroup ? (groupName || 'Group Chat') : (listUser[0].display_name || 'Noir User');
                dispatch(
                  createChannel({
                    data: {
                      name: channelName,
                      participant_ids: [...participantIds, currentUser.user_id],
                      type: channelType || ChannelType.ONE_ONE,
                      message: {
                        type: MessageType.RECORD,
                        content: [data.file_path],
                      },
                    },
                    onSuccess: (result: ICreateChannel) => {
                      setIdChannel(result.id);
                      setTimeout(() => {
                        NavigationActionsService.hideLoading();
                        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
                      }, 100);
                    },
                    onFail: (error) => {
                      NavigationActionsService.hideLoading();
                      error && NavigationActionsService.showErrorPopup(error);
                    }
                  })
                )
              }
            },
            onFail: error => {
              setTimeout(() => {
                NavigationActionsService.hideLoading();
                NavigationActionsService.showErrorPopup(error);
              }, 500);
            },
          }),
        );
      }
    });
  };

  const _onLongPress = async () => {
    const response = await requestRecordAudioPermission();
    if (response) {
      SoundRecorder.start(SoundRecorder.PATH_DOCUMENT + `/${uuid.v4()}.aac`).then(function () {
        console.log('Started recording');
      });
    }
  };

  /* ITEM MESSAGES handle action*/
  const onPressBack = () => {
    isFromChannel ? NavigationActionsService.popToChannelScreen() : NavigationActionsService.pop();
  };

  const onPressSettings = () => {
    if (isChatGroup) {
      NavigationActionsService.push(GROUP_SETTINGS, { channelId: idChannel, isFromChannel }, true);
    }
  }

  const actionSendTextMessage = (channelId: string, type: MessageType, content: string) => {
    dispatch(
      sendMessage({
        data: {
          channel_id: channelId,
          message: {
            type: type,
            content: content,
          },
        },
        onFail: error => {
          if (error && error.code == 6005) {
            // User have been removed
            showLeftGroupPopup();
            return;
          }
          NavigationActionsService.showErrorPopup(error);
        },
      }),
    );
    tempImage = [];
    setImagesPicker([]);
  };

  const actionSendMediaMessage = (channelId: string, type: MessageType, content: string[]) => {
    dispatch(sendMessage({
      data: {
        channel_id: channelId,
        message: {
          type: type,
          content: content
        }
      },
      onSuccess: () => {
        NavigationActionsService.hideLoading();
      },
      onFail: (error) => {
        if (error && error.code == 6005) {
          // User have been removed
          showLeftGroupPopup();
          return;
        }
        NavigationActionsService.hideLoading();
        error && NavigationActionsService.showErrorPopup(error);
      }
    }))
    tempImage = [];
    setImagesPicker([]);
  }

  const onSendMessage = (type: MessageType, content: string | string[]) => {
    if (idChannel) {
      switch (type) {
        case MessageType.TEXT:
          const value = content as string;
          value && value !== '' && actionSendTextMessage(idChannel, type, value);
          break;
        case MessageType.IMAGE:
        case MessageType.VIDEO:
          const values = content as string[];
          values && actionSendMediaMessage(idChannel, type, values);
          break;
      }
      setTimeout(() => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }, 100);
    } else {
      const listUser = listUserSelected || [];
      const participantIds = clone(listUser).map(item => item.user_id);
      const channelName = isChatGroup ? (groupName || 'Group Chat') : (listUser[0].display_name || 'Noir User');
      if (type !== MessageType.RECORD) {
        dispatch(
          createChannel({
            data: {
              name: channelName,
              participant_ids: [...participantIds, currentUser.user_id],
              type: channelType || ChannelType.ONE_ONE,
              message: {
                type: type,
                content: content,
              },
            },
            onSuccess: (result: ICreateChannel) => {
              setIdChannel(result.id);
              setTimeout(() => {
                flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
              }, 100);
            },
            onFail: error => {
              error && NavigationActionsService.showErrorPopup(error);
            },
          }),
        );
      }
      tempImage = [];
      setImagesPicker([]);
    }
  };

  const onPressPickImage = () => {
    documentRef.current.show();
  };

  const onRemoveImage = (index: number) => {
    const imagesClone = clone(imagesPicker);
    imagesClone.splice(index, 1);
    tempImage = imagesClone;
    setImagesPicker(imagesClone);
  };

  const onPressAvatar = (user_id: string) => {
    NavigationActionsService.showLoading();
    dispatch(getProfileDetail({
      user_id: user_id,
      onSuccess: () => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.push(PROFILE_OTHERS, { user_id: user_id }, true);
        }, 500);
      },
      onFail: error => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        }, 500);
      }
    }))
  }

  const keyExtractor = (item: IMessage, index: number) => {
    return item.message.id;
  };

  const handleLoadMore = () => {
    if (!loading && messageList.next !== null && messageList.results.length !== messageList.count) {
      getListMessage();
    }
  };

  const renderPicker = () => (
    <DocumentPickerImage ref={documentRef} titlePopup={'Choose Photo or Videos'} onCompleted={onCompletedPicker} isMulti={true} isHasVideo={true} />
  );

  const renderEmptyComponent = () => <EmptyData style={{ transform: [{ scaleY: -1 }] }} />;

  const renderFooter = () => {
    return loading && messageList.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderChatList = () => (
    <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'android' ? -500 : 0}>
      <View style={[styles.container, { marginHorizontal: 15 }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={30}
          contentContainerStyle={{ paddingTop: 10 }}
          ref={flatListRef}
          data={data}
          inverted
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
      <AddNewMessageForm
        onSendMessage={onSendMessage}
        onPressPickImage={onPressPickImage}
        _onLongPress={_onLongPress}
        _onPressOut={_onPressOut}
        onRemoveImage={onRemoveImage}
        images={imagesPicker}
      />
    </KeyboardAvoidingView>
  );

  const renderHeader = () => {
    const name = listUserSelected && listUserSelected[0].display_name;
    const rightIcon = isChatGroup ? CHAT_SETTINGS : undefined;
    const rightAction = isChatGroup ? onPressSettings : undefined;

    return (
      <CustomHeader
        leftImage={BACK}
        rightImage={rightIcon}
        title={groupName || displayName || name}
        leftAction={onPressBack}
        rightAction={rightAction}
      />
    );
  };

  const prepareMessageProps = (item: IMessage, index: number): MessageItemProps => {
    const { message } = item;
    const { id, content, modified, status, type, sender, assets } = message;

    const isCurrentUser = sender && sender.user_id === currentUser.user_id;
    const urls = assets.map(item => (item.url ? item.url : ''));
    const prevMessage = messageList.results[index + 1];
    const isSameDay = prevMessage ? moment(message.modified).isSame(prevMessage.modified, 'date') : false;
    const isShowStatus = isCurrentUser && index === 0;
    const durations = assets.map(item => (item.duration ? item.duration : 5000));
    const duration = (durations[0] ? durations[0] : 5000) * 1000 + 500;

    return {
      channelId: channelId,
      messageId: id,
      time: modified,
      showDate: !isSameDay,
      currentId: currentId,
      paused: item.isPause,
      isCurrentUser, content,
      status, isShowStatus,
      type, urls,
      duration,
      onPressImage: onShowImageViewer,
      onPressPlay: onPressPlay,
      onPressPause: onPressPause,
      onPressVideo: onPressVideo
    };
  }

  const prepareGroupProps = (item: IMessage, index: number): GroupProps => {
    if (!isChatGroup) return {};
    if (item.message.type === MessageType.SYSTEM) return {};

    const { message } = item;
    const { sender } = message;
    const { display_name, avatar, user_id } = sender;
    const prevMessage = messageList.results[index + 1];
    const nextMessage = messageList.results[index - 1];

    const showDisplayName = !prevMessage || prevMessage.sender && prevMessage.sender.user_id !== sender.user_id;
    const showAvatar = !nextMessage || !nextMessage.sender || nextMessage.sender && nextMessage.sender.user_id !== sender.user_id;

    return {
      user_id,
      showDisplayName,
      showAvatar,
      display_name,
      avatar,
      onPressAvatar
    }
  }

  const renderItem = ({ item, index }: { item: IMessage; index: number }) => {
    const messageProps = prepareMessageProps(item, index);
    const groupProps = prepareGroupProps(item, index);

    return (
      <MessageItem
        isChatGroup={isChatGroup}
        messageProps={messageProps}
        groupProps={groupProps}
      />
    );
  };

  return (
    <Container >
      <View style={styles.container}>
        {renderHeader()}
        {renderChatList()}
        {renderPicker()}
      </View>
    </Container>
  );
};

export default Message;
