import {useFocusEffect, useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {LargeList} from 'react-native-largelist-v3';

import {EMPTY_TYPE} from '../../assets/constants';
import {EmptyListView} from '../../components/List/EmptyListView';
import ScrollViewFooter from '../../components/ScrollViewFooter';
import ScrollViewHeader from '../../components/ScrollViewHeader';
import {logStringee} from '../../service/logService';
import {StringeeContext} from '../Call/StringeeContext';
import ConversationItem, {ITEM_HEIGHT} from '../Chat/components/ConversationItem';
import {parseConversation} from '../Chat/types';
import {OBJECT_TYPE} from '../Chat/useChat';
import {useGetUsers} from '../Chat/useGetUsers';
import ScreenIds from '../ScreenIds';

const CONVERSATION_COUNT = 20;

const TabChatHistory = () => {
  const navigation = useNavigation();
  const {client, stringeeUserId, connected, chat} = useContext(StringeeContext);
  const listRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const {getUsersForConversations} = useGetUsers();

  useFocusEffect(
    useCallback(() => {
      if (connected) {
        getConversations();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected, getConversations]),
  );

  useEffect(() => {
    const id = chat.addListener(ScreenIds.MessageNotification, event => {
      if (event.objectType !== OBJECT_TYPE.CONVERSATION) return;
      const newConversation = parseConversation(event.objectChanges[0], stringeeUserId);
      updateConversation(newConversation);
    });
    return () => {
      chat.removeListener(id);
    };
  }, [chat, stringeeUserId]);

  const updateConversation = newConversation => {
    setConversations(previousConversations => {
      const index = previousConversations.findIndex(value => value.id === newConversation.id);
      if (index !== -1) {
        previousConversations.splice(index, 1);
        return [newConversation, ...previousConversations];
      }
      return [...previousConversations];
    });
  };

  const getConversations = useCallback(
    (datetime = null, onSuccess = () => {}) => {
      setLoading(true);
      const isLoadMore = datetime !== null;
      const callback = (status, code, message, data) => {
        logStringee('getConversations', {status, code, message, data});
        const items = data
          .filter(value => value.participants.length > 1)
          .map(value => parseConversation(value, stringeeUserId));
        getUsersForConversations(items, newItems => {
          if (isLoadMore) {
            setConversations(prevState => {
              return [...prevState, ...newItems];
            });
          } else {
            setConversations(newItems);
          }
          setLoading(false);
          onSuccess();
        });
      };

      const isAscending = false;
      if (isLoadMore) {
        client.current.getConversationsBefore(datetime, CONVERSATION_COUNT, isAscending, callback);
      } else {
        client?.current?.getLastConversations(CONVERSATION_COUNT, isAscending, callback);
      }
    },
    [client, getUsersForConversations, stringeeUserId],
  );

  const deleteConversation = conversationId => {
    chat.deleteConversation(conversationId, () => {
      setConversations(previousConversations => {
        const index = previousConversations.findIndex(value => value.id === conversationId);
        if (index !== -1) {
          previousConversations.splice(index, 1);
        }
        return [...previousConversations];
      });
    });
  };

  const onRefresh = () => {
    getConversations(null, () => {
      listRef.current?.endRefresh();
    });
  };

  const onLoadMore = () => {
    if (conversations.length === 0) {
      listRef.current?.endLoading();
      return;
    }
    const datetime = conversations[conversations.length - 1].rawDateTime;
    getConversations(datetime, () => {
      listRef.current?.endLoading();
    });
  };

  const renderItem = ({item}) => {
    const conversationId = item.id;
    const onPress = () => {
      navigation.navigate(ScreenIds.Chat, {
        conversationId: conversationId,
        isGroup: item.isGroup,
        groupName: item.groupName,
        participants: item.participants,
      });
    };
    const onPressDelete = () => {
      deleteConversation(conversationId);
    };
    return <ConversationItem {...item} onPress={onPress} onPressDelete={onPressDelete} />;
  };

  return (
    <>
      {isEmpty(conversations) && <EmptyListView loading={loading} type={EMPTY_TYPE.CHAT} />}
      <LargeList
        ref={listRef}
        refreshHeader={ScrollViewHeader}
        loadingFooter={ScrollViewFooter}
        data={[{items: conversations}]}
        heightForIndexPath={() => ITEM_HEIGHT}
        renderIndexPath={({row}) => renderItem({item: conversations[row]})}
        onRefresh={onRefresh}
        onLoading={onLoadMore}
      />
    </>
  );
};

export default TabChatHistory;
