/* eslint-disable no-underscore-dangle */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image, Keyboard, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GiftedChat, MessageImage, MessageImageProps} from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';

import {AppContext} from '../../appData/appContext/appContext';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {small} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import {useGetSecuredFileUrl} from '../../hooks/useGetSecuredFileUrl';
import logService, {logStringee} from '../../service/logService';
import {downloadFileAzure} from '../../utils/fileHandler';
import {StringeeContext} from '../Call/StringeeContext';
import {useMount} from '../commonHooks';
import {LiveChatRoomContainer} from '../LiveChat/LiveChatRoomScreen';
import ScreenIds from '../ScreenIds';
import ActionList from './components/ActionList';
import Header, {MoreIcon} from './components/Header';
import MenuList from './components/MenuList';
import {MessageFile} from './components/MessageFile';
import {IChatMessage, IParticipant, MESSAGE_TYPE, parseMessages} from './types';
import {CHANGE_TYPE, OBJECT_TYPE} from './useChat';
import {useChatActions} from './useChatActions';
import {useGetUsers} from './useGetUsers';

const count = 20;
const isAscending = false;

type ChatScreenProps = {
  route: {
    params: {
      conversationId: String,
      isGroup: Boolean,
      groupName?: String,
      participants: IParticipant[],
    },
  },
};

const MODAL_TYPE = {
  MORE: 1,
  ACTION: 2,
};

const initMessages: IChatMessage[] = [];

const ChatScreen = ({route, navigation}: ChatScreenProps) => {
  const {conversationId, isGroup, groupName, participants: originPaticipants} = route?.params ?? {};
  const {showAppModal} = useContext(AppContext);
  const {
    client,
    stringeeUserId: currentUserId,
    chat: {addListener, removeListener, markReadConversation, deleteConversation},
  } = useContext(StringeeContext);
  const moreModalRef = useRef(null);
  const [modalType, setModalType] = useState(MODAL_TYPE.MORE);
  const [messages, setMessages] = useState(initMessages);
  const [participants, setParticipants] = useState([]);
  const {getUsersForParticipants} = useGetUsers();
  const [{name, avatar, isAgent, agentId}, setUserInfo] = useState({});
  const [isLoadingEarlier, setLoadingEarlier] = useState(false);
  const getSecuredFileUrlAsync = useGetSecuredFileUrl();

  const chatActions = useChatActions({
    onUploadImagesSuccess: (response: [{imageFullPath: String}]) => {
      const tmpMessages = response.map(value => {
        const message: IChatMessage = {
          _id: uuid.v4(),
          createdAt: new Date(),
          user: {_id: currentUserId},
          image: value.securedUrl,
          imageRatio: value.ratio,
        };
        return message;
      });
      onSend(tmpMessages, MESSAGE_TYPE.PHOTO);
    },
  });

  useMount(() => {
    getUsersForParticipants(originPaticipants, newParticipants => {
      setParticipants(newParticipants);
      const userInfo = newParticipants.filter(value => value.userId !== currentUserId)[0];
      setUserInfo(userInfo);
      getLastMessages(newParticipants);
    });
  });

  useEffect(() => {
    const id = addListener(ScreenIds.Chat, event => {
      if (event.objectType !== OBJECT_TYPE.MESSAGE || event.changeType !== CHANGE_TYPE.INSERT) {
        return;
      }
      const newMessages = parseMessages(event.objectChanges, participants);
      if (newMessages.length === 0) {
        return;
      }
      const lastMessage = newMessages[0];
      const isNotSameConversation = lastMessage?.conversationId !== conversationId;
      const isCurrentUserId = lastMessage?.user._id === currentUserId;
      if (isNotSameConversation || isCurrentUserId) {
        return;
      }
      setMessages(previousMessages => {
        return GiftedChat.append(previousMessages, newMessages);
      });
    });
    return () => {
      removeListener(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants]);

  const getLastMessages = newParticipants => {
    client.current.getLastMessages(
      conversationId,
      count,
      isAscending,
      true,
      true,
      (status, code, message, data) => {
        logStringee('getLastMessages', {status, code, message, data});
        const items = parseMessages(data, newParticipants);
        setMessages(items);
      },
    );
  };

  const onLoadEarlier = () => {
    if (isLoadingEarlier) {
      return;
    }
    setLoadingEarlier(true);
    const sequence = messages[messages.length - 1].sequence;
    client.current.getMessagesBefore(
      conversationId,
      sequence,
      count,
      isAscending,
      true,
      true,
      (status, code, message, data) => {
        const items = parseMessages(data, participants);
        setMessages(previousMessages => {
          return GiftedChat.prepend(previousMessages, items);
        });
        setLoadingEarlier(false);
      },
    );
  };

  const onPressBack = () => {
    markReadConversation(conversationId, () => {
      navigation.goBack();
    });
  };

  const onPressMore = () => {
    Keyboard.dismiss();
    setModalType(MODAL_TYPE.MORE);
    moreModalRef.current.open();
  };

  const closeMoreModal = () => {
    moreModalRef?.current.close();
  };

  const onPressInfo = () => {
    closeMoreModal();
    navigation.navigate(ScreenIds.AgentManagement, {
      agentId,
    });
  };

  const onPressDeleteConversation = () => {
    closeMoreModal();
    showConfirmAlert(() => {
      deleteConversation(conversationId, () => {
        onPressBack();
      });
    });
  };

  const onPressGroup = () => {
    closeMoreModal();
    navigation.navigate(ScreenIds.ChatMember, {
      participants: participants?.filter(value => value.userId !== currentUserId),
    });
  };

  const showConfirmAlert = callback => {
    showAppModal({
      isVisible: true,
      title: translate('chat.confirmDelete.title'),
      message: translate('chat.confirmDelete.message'),
      cancelText: translate('chat.confirmDelete.left'),
      cancelButtonStyle: styles.cancelButtonStyle,
      cancelTextStyle: styles.cancelTextStyle,
      okButtonStyle: styles.okButtonStyle,
      okText: translate('chat.confirmDelete.right'),
      onCancelHandler: callback,
      onOkHandler: () => {},
    });
  };

  const onPressAction = async () => {
    Keyboard.dismiss();
    setModalType(MODAL_TYPE.ACTION);
    moreModalRef.current.open();
  };

  const onSend = async (messages2: IChatMessage[], type = MESSAGE_TYPE.TEXT) => {
    for (const message of messages2) {
      const data = {
        type: type,
        convId: conversationId,
        message: {},
      };
      switch (type) {
        case MESSAGE_TYPE.PHOTO:
          data.message.photo = {
            filePath: message.image,
            thumbnail: '',
            ratio: message.imageRatio,
          };
          break;
        case MESSAGE_TYPE.FILE:
          data.message.file = {
            filePath: message.fileUrl,
            filename: message.text,
            length: message.fileLength,
          };
          data.message.content = data.message.file.filename;
          break;
        default:
          data.message.content = message.text;
          break;
      }
      await new Promise(resolve => {
        client.current.sendMessage(data, (status, code, responseMessage) => {
          logStringee('sendMessage', {status, code, message: responseMessage});
          resolve();
        });
      });
    }
    setMessages(previousMessages => {
      return GiftedChat.append(previousMessages, messages2.reverse());
    });
  };

  const onPressDocument = () => {
    moreModalRef.current.close();
    chatActions
      .openDocument()
      .then(files => {
        const tmpMessages = files.map(file => {
          const message: IChatMessage = {
            _id: uuid.v4(),
            createdAt: new Date(),
            user: {_id: currentUserId},
            text: file.name,
            fileUrl: file.securedUrl,
            fileLength: file.length,
          };
          return message;
        });
        onSend(tmpMessages, MESSAGE_TYPE.FILE);
      })
      .catch(logService.log);
  };

  const onPressCamera = () => {
    moreModalRef.current.close();
    chatActions.openCamera();
  };

  const onPressGallery = () => {
    moreModalRef.current.close();
    chatActions.openGallery();
  };

  const onDocumentLinkPress = async (fileUrl: String, fileName: String) => {
    const securedUrl = await getSecuredFileUrlAsync(fileUrl);
    downloadFileAzure(securedUrl, fileName);
  };

  const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToTop = 80;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  };

  const renderModals = () => {
    return (
      <ModalWithModalize getModalRef={moreModalRef}>
        {modalType === MODAL_TYPE.MORE ? (
          <MenuList
            isGroup={isGroup}
            isAgent={isAgent}
            onPressInfo={onPressInfo}
            onPressDelete={onPressDeleteConversation}
            onPressGroup={onPressGroup}
          />
        ) : (
          <ActionList
            onPressFile={onPressDocument}
            onPressCamera={onPressCamera}
            onPressGallery={onPressGallery}
          />
        )}
      </ModalWithModalize>
    );
  };

  return (
    <BaseScreen
      title=""
      onBackPress={onPressBack}
      leftComponent={<Header avatar={avatar} name={name} isGroup={isGroup} groupName={groupName} />}
      rightComponent={<MoreIcon onPress={onPressMore} />}
      modals={renderModals()}>
      <LiveChatRoomContainer
        userId={currentUserId}
        messages={messages}
        listViewProps={{
          showsVerticalScrollIndicator: false,
          scrollEventThrottle: 400,
          onScroll: ({nativeEvent}) => {
            if (isCloseToTop(nativeEvent)) {
              onLoadEarlier();
            }
          },
        }}
        renderActionsButton={
          <TouchableOpacity style={styles.actionButtonStyle} onPress={onPressAction}>
            <Image source={IMAGES.IC_ADD_CIRCLE} resizeMode="center" style={styles.buttonAddMore} />
          </TouchableOpacity>
        }
        renderMessageFile={props => <MessageFile {...props} onPress={onDocumentLinkPress} />}
        renderMessageImage={props => <MessageImageSecured {...props} />}
        onSend={onSend}
      />
    </BaseScreen>
  );
};

const MessageImageSecured = ({...props}: MessageImageProps) => {
  const [image, setImage] = useState(props.currentMessage.image);
  const getSecuredFileUrlAsync = useGetSecuredFileUrl();

  useMount(async () => {
    const responseImage = await getSecuredFileUrlAsync(image);
    setImage(responseImage);
  });

  return (
    <MessageImage
      {...props}
      currentMessage={{
        ...props.currentMessage,
        image: image,
      }}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  cancelButtonStyle: {
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.STATE_ERROR_DARK,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  cancelTextStyle: {
    color: COLORS.STATE_ERROR_DARK,
  },
  okButtonStyle: {
    flex: 1,
  },
  actionButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: small,
  },
  buttonAddMore: {width: 20, height: 20},
});
