import {useCallback, useEffect, useState} from 'react';

import {logStringee} from '../../service/logService';
import {IChatMessage, IConversation} from './types';

export const OBJECT_TYPE = {
  CONVERSATION: 0,
  MESSAGE: 1,
};
export const CHANGE_TYPE = {
  INSERT: 0,
  UPDATE: 1,
  DELETE: 2,
};

type ChatEvent = {
  objectType: Number,
  objectChanges: [],
  changeType: Number,
};

export type ChatType = {
  unreadCount: Number,
  onObjectChange: () => {},
  lastConversation: IConversation,
  lastMessages: IChatMessage[],
  addListener: (id: String, handler: (event: ChatEvent) => {}) => String,
  removeListener: (id: String) => {},
  markReadConversation: (id: String, onSuccess: () => {}) => {},
  deleteConversation: (id: String, onSuccess: () => {}) => {},
};

export const useChat = ({client, connected, notLoggedIn}) => {
  const [listeners] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!notLoggedIn && connected) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [notLoggedIn, connected, fetchUnreadCount]);

  const addListener = (id: String, handler: () => {}) => {
    listeners.push({id, handler});
    return id;
  };

  const removeListener = id => {
    const index = listeners.findIndex(value => value.id === id);
    listeners.splice(index, 1);
  };

  const onObjectChange = ({objectType, objectChanges, changeType}: ChatEvent) => {
    logStringee(`onObject${objectType}Change${objectType}`, {objectChanges});
    listeners.forEach(value => value.handler({objectType, objectChanges, changeType}));
    if (objectType === OBJECT_TYPE.CONVERSATION) {
      fetchUnreadCount();
    }
  };

  const fetchUnreadCount = useCallback(() => {
    const conversationCount = 100;
    const isAscending = false;
    client?.current?.getLastConversations(
      conversationCount,
      isAscending,
      (status, code, message, data: IConversation[]) => {
        if (data?.length > 0) {
          const count = data
            .map(value => value.unreadCount)
            .reduce((previousValue, currentValue) => {
              return previousValue + currentValue;
            });
          setUnreadCount(count);
        }
      },
    );
  }, [client]);

  const markReadConversation = (conversationId, onSuccess) => {
    client.current.markConversationAsRead(conversationId, (status, code, message) => {
      logStringee('markConversationAsRead', {status, code, message});
      fetchUnreadCount();
      onSuccess();
    });
  };

  const deleteConversation = (id, onSuccess) => {
    logStringee('deleteConversation request', {id});
    client.current.deleteConversation(id, (status, code, message, data) => {
      logStringee('deleteConversation', {id, status, code, message, data});
      fetchUnreadCount();
      onSuccess();
    });
  };

  return {
    unreadCount,
    addListener,
    removeListener,
    onObjectChange,
    markReadConversation,
    deleteConversation,
  };
};
