import {useState} from 'react';

import {logStringee} from '../../service/logService';
import {getWidgetKey} from '../../service/stringee/getServerAddresses';
import {useStringeeClient} from '../../service/stringee/useStringeeClient';
import {ChatProfileType, parseReceiveMessage, UIMessage} from './types';

export type LiveChatType = {
  liveChatUserId: String,
  chatProfile: ChatProfileType,
  inConv: Boolean,
  lastMessage: UIMessage,
  getChatProfile: () => {},
  onPressConnect: () => {},
  onPressStart: () => {},
  onPressEnd: () => {},
  onPressSend: (text: String, type: Number) => {},
};

export const useLiveChat = () => {
  const {
    client,
    connected,
    userId,
    onConnect,
    onDisConnect,
    onFailWithError,
    onRequestAccessToken,
  } = useStringeeClient();

  const [chatProfile, setChatProfile] = useState({});
  const [conversation, setConversation] = useState(null);
  const [inConv, setInConv] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  // Receive custom message
  const onCustomMessage = data => {
    logStringee('onCustomMessage', data);
  };

  // Receive event of Conversation or Message
  const onObjectChange = data => {
    logStringee('onObjectChange', data);
    const receiveMessage = parseReceiveMessage(data);
    if (receiveMessage) {
      setLastMessage(receiveMessage);
    }
  };

  // Receive when chat request to queue is timeout
  const onTimeoutInQueue = data => {
    logStringee('onTimeoutInQueue', data);
    // setInConv(false);
  };

  // Receive when conversation ended
  const onConversationEnded = data => {
    logStringee('onConversationEnded', data);
    setInConv(false);
  };

  // Receive when user send beginTyping
  const onUserBeginTyping = data => {
    logStringee('onUserBeginTyping', data);
  };

  // Receive when user send endTyping
  const onUserEndTyping = data => {
    logStringee('onUserEndTyping', data);
  };

  const getChatProfile = ({onError}) => {
    const widgetKey = getWidgetKey();
    client.current.getChatProfile(widgetKey, (status, code, message, data) => {
      logStringee('getChatProfile', {status, code, message, data});
      if (!status) {
        onError();
        return;
      }
      if (data != null) {
        setChatProfile(data);
      }
    });
  };

  const onPressConnect = (name, email) => {
    client.current.getLiveChatToken(getWidgetKey(), name, email, (status, code, message, token) => {
      logStringee('getLiveChatToken', {status, code, message, token});
      client.current.connect(token);
      setLastMessage(null);
    });
  };

  const onPressStart = (queueId, name, email, phone) => {
    const createConversation = () => {
      client.current.createLiveChatConversation(queueId, (status, code, message, data) => {
        logStringee('createLiveChatConversation', {status, code, message, data});
        setConversation(data);
        setInConv(true);
      });
    };

    const param = {name, email, phone};
    client.current.updateUserInfoWithParam(param, (status, code, message, data) => {
      logStringee('updateUserInfoWithParam', {param, status, code, message, data});
      createConversation();
    });
  };

  const onPressEnd = () => {
    if (!conversation?.id) {
      setInConv(false);
      return;
    }
    client.current.endChat(conversation.id, (status, code, message) => {
      logStringee('endChat', {status, code, message});
    });
  };

  const onPressSend = (text = 'Hello', type = 1) => {
    const input = {
      message: {
        content: text,
      },
      type,
      convId: conversation.id,
    };

    client.current.sendMessage(input, (status, code, message) => {
      logStringee('sendMessage', {status, code, message});
    });
  };

  const eventHandlers = {
    onConnect: onConnect,
    onDisConnect: onDisConnect,
    onFailWithError: onFailWithError,
    onRequestAccessToken: onRequestAccessToken,
    onCustomMessage: onCustomMessage,
    onObjectChange: onObjectChange,
    onTimeoutInQueue: onTimeoutInQueue,
    onConversationEnded: onConversationEnded,
    onUserBeginTyping: onUserBeginTyping,
    onUserEndTyping: onUserEndTyping,
  };

  const result: LiveChatType = {
    client,
    eventHandlers,
    connected,
    userId,
    //
    chatProfile,
    inConv,
    lastMessage,
    getChatProfile,
    onPressConnect,
    onPressStart,
    onPressSend,
    onPressEnd,
  };

  return result;
};
