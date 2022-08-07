import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GiftedChat, Send, Avatar, InputToolbar, Composer, LoadEarlier, Message, Bubble } from 'react-native-gifted-chat';
import { SocketManager } from '@/shared/socket/socket-manager';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, loadMoreMessage } from '@/redux/messages/actions';
import { MessageInit } from '@/redux/messages/reducer';
import { UserInit } from '@/redux/user/reducer';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { TimeChat } from '@/components/CustomTime';
import { isIphoneX } from '@/shared/devices';
import store from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { CONVERSATION_STARTED_MESSAGE } from '@/constants/app';
import SendSVG from '@/components/SVG/SendSVG';

interface Prop {
  roomId?: string;
  isFromHistory?: boolean;
}
let onScroll = false;

export function Chat(props: Prop): ReactElement {
  const { roomId, isFromHistory } = props;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getMessage = useSelector((state: MessageInit) => state.message.chat[roomId]);
  const userId = useSelector((state: UserInit) => state.user.data.id);
  const locale = useSelector((state: RootState) => state.app.locale);

  useEffect(() => {
    async function connectSocket() {
      // fix can't send first message
      await SocketManager.close();
      await SocketManager.connect();
      roomId && dispatch(getMessages({ roomId }));
    }

    connectSocket().then(_r => {});
  }, []);

  useEffect(() => {
    getMessage && setMessages(getMessage);
    if (getMessage && getMessage.length > 0 && store.getState().user.data.id !== getMessage[0].user._id) {
      roomId && SocketManager.instanceChat.readMessage(roomId);
    }
  }, [getMessage && getMessage.length]);

  const onSend = useCallback((messages = []) => {
    if (messages[0].text.trim().length === 0) {
      return;
    }
    SocketManager.instanceChat.sendMessage(roomId, messages[0].text);
  }, []);

  const renderAvatar = avatarProps => {
    if (avatarProps.currentMessage.text === CONVERSATION_STARTED_MESSAGE) {
      return null;
    }
    return (
      <Avatar
        {...avatarProps}
        containerStyle={{
          left: {
            marginRight: -6,
          },
          right: {},
        }}
        imageStyle={{
          left: styles.imageLeft,
          right: styles.imageRight,
        }}
      />
    );
  };

  const renderMessage = avatarProps => {
    return <Message {...avatarProps} />;
  };

  const renderInputToolbar = toolbarProps => {
    if (isFromHistory) {
      return null;
    }
    return <InputToolbar {...toolbarProps} containerStyle={styles.inputContainer} />;
  };

  const renderComposer = toolbarProps => (
    <Composer {...toolbarProps} placeholderTextColor={colors.gray_400} textInputStyle={styles.composerInput} />
  );

  const renderChatEmpty = () => (
    <View style={styles.wrapEmpty}>
      <Text>{language('startChat')}</Text>
    </View>
  );

  const renderLoadEarlier = toolbarProps => (
    <LoadEarlier {...toolbarProps} activityIndicatorColor={colors.border_grey} wrapperStyle={{ backgroundColor: colors.transparent }} />
  );

  const onEndReached = () => {
    if (!onScroll) return;
    loadMore();
    onScroll = false;
    setIsLoading(true);
  };

  const loadMore = () => {
    setTimeout(() => {
      dispatch(
        loadMoreMessage({
          roomId,
          lastTimeMessage: messages[messages.length - 1].createdAt,
          onSuccess: () => setIsLoading(false),
        }),
      );
    }, 1000);
  };

  const onMomentumScrollBegin = () => {
    onScroll = true;
  };

  const renderSend = sendProps => {
    if (isFromHistory) {
      return null;
    }

    return (
      <Send {...sendProps} containerStyle={styles.sendWrapper}>
        <SendSVG />
      </Send>
    );
  };

  const renderTime = _sendProps => null;

  const renderQuickReplies = sendProps => {
    return <TimeChat {...sendProps} />;
  };

  const renderBubble = sendProps => (
    <Bubble
      {...sendProps}
      containerStyle={{
        left: {
          marginLeft: 12,
        },
      }}
      wrapperStyle={{
        right: {
          paddingVertical: 4,
          marginBottom: 5,
          paddingHorizontal: 6,
          borderBottomRightRadius: 30,
          borderTopRightRadius: 30,
          borderRadius: 30,
        },
        left: {
          paddingVertical: 4,
          marginBottom: 5,
          paddingHorizontal: 6,
          borderRadius: 30,
          borderBottomLeftRadius: 30,
          borderTopLeftRadius: 30,
        },
      }}
    />
  );

  return (
    <GiftedChat
      messages={messages.map(item => {
        return item.text === CONVERSATION_STARTED_MESSAGE ? { ...item, text: language('conversationStarted') } : item;
      })}
      keyboardShouldPersistTaps="handled"
      onSend={messages => onSend(messages)}
      user={{
        _id: userId,
      }}
      alwaysShowSend
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderQuickReplies={renderQuickReplies}
      renderTime={renderTime}
      renderMessage={renderMessage}
      placeholder={language('typeMessage')}
      renderAvatarOnTop
      renderAvatar={renderAvatar}
      renderComposer={renderComposer}
      renderInputToolbar={renderInputToolbar}
      renderChatEmpty={renderChatEmpty}
      renderLoadEarlier={renderLoadEarlier}
      isLoadingEarlier={isLoading}
      loadEarlier={isLoading}
      listViewProps={{
        onEndReached: onEndReached,
        scrollEventThrottle: 1,
        onEndReachedThreshold: 0.1,
        onMomentumScrollBegin: onMomentumScrollBegin,
      }}
      bottomOffset={isIphoneX() ? 22 : -12}
      minComposerHeight={40}
      maxComposerHeight={106}
      minInputToolbarHeight={50}
      locale={locale}
    />
  );
}

const styles = StyleSheet.create({
  wrapEmpty: {
    transform: [{ scaleY: -1 }],
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendWrapper: {
    marginLeft: 10,
    marginBottom: 5,
  },
  inputContainer: {
    borderTopWidth: 0,
    shadowRadius: 5,
    paddingHorizontal: 24,

    paddingBottom: 12,
  },
  imageLeft: {
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  imageRight: {
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  composerInput: {
    backgroundColor: colors.gray_100,
    paddingTop: 12,
    borderRadius: 19,
    paddingLeft: 18,
    fontSize: 14,
    paddingVertical: 11,
    textAlignVertical: 'top',
    overflow: 'hidden',
    padding: 10,
  },
});
