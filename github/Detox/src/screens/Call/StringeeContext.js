import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {StringeeClient} from 'stringee-react-native';

import {
  GenerateStringeeAuthTokenMutationVariables,
  GenerateStringeeAuthTokenResponse,
  GetUserByIdQueryVariables,
  GetUserResponse,
  useGenerateStringeeAuthTokenMutation,
  useGetUserByIdLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {getUserId} from '../../appData/user/selectors';
import {FETCH_POLICY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {getConfigs} from '../../configs';
import {logStringee} from '../../service/logService';
import {getServerAddresses} from '../../service/stringee/getServerAddresses';
import {useStringePush} from '../../service/stringee/useStringeeClient';
import {getUserFullName} from '../../utils/UserAgentUtil';
import {useLogin} from '../Auth/useLogin';
import {ChatType, useChat} from '../Chat/useChat';
import {LiveChatType, useLiveChat} from '../LiveChat/useLiveChat';
import ScreenIds from '../ScreenIds';
import WithStringeeClient from '../WithStringeeClient';

interface ICustomMessagePayload {
  fullName?: string;
  avatar?: string;
  objectId?: string;
  objectType?: string;
}

type Value = {
  client: any,
  stringeeUserId: String,
  callHotline: () => {},
  callUser: (calleeId: String, customData: ICustomMessagePayload, isFO: Boolean) => {},
  chatUser: (id: String, name: String, navigation, isFO: Boolean) => {},
  unRegisterPush: () => {},
  clearLocalDatabase: () => {},
  liveChat: LiveChatType,
  chat: ChatType,
  connected: Boolean,
};

const defaultValue: Value = {};

const StringeeContext = createContext(defaultValue);

const StringeeProvider = props => {
  const {showErrorAlert} = useContext(AppContext);
  const {notLoggedIn, showLogin} = useLogin();
  const {token, user} = useGetStringeeToken({notLoggedIn});
  const {client, getClientId, connected, setConnected, setDeviceToken, unRegisterPush} =
    useStringePush(!notLoggedIn, user?.name, user?.avatar);
  const liveChat = useLiveChat();
  const chat = useChat({client, connected, notLoggedIn});
  const stringeeRef = useRef();

  const value: Value = {
    client,
    stringeeUserId: user?.stringeeUserId,
    connected,
    callHotline: () => {
      if (notLoggedIn) {
        showLogin(() => {});
      } else {
        const callOptions = {
          from: user.phoneNumber,
          to: getConfigs().stringee.HOTLINE_NUMBER,
          fullName: translate('call.hotline'),
          isVideoCall: false,
          onSuccess: () => {},
          onError: onCallError,
        };
        makeCall(callOptions);
      }
    },

    callUser: (calleeId, customData, isFO = false) => {
      const toUserId = getStringeeId(calleeId, isFO);
      const sendCustomMessage = callId => {
        const data = {
          ...customData,
          fullName: user?.name,
          avatar: user?.avatar,
          callId,
        };
        const dataString = JSON.stringify(data);
        client.current.sendCustomMessage(
          //
          toUserId,
          dataString,
          (status, code, message) => {
            logStringee('sendCustomMessage', {data, status, code, message});
          },
        );
      };
      const callOptions = {
        from: user?.name,
        to: toUserId,
        fullName: customData?.fullName,
        avatar: customData?.avatar,
        isVideoCall: false,
        onSuccess: sendCustomMessage,
        onError: onCallError,
      };
      makeCall(callOptions);
    },

    chatUser: (userId, name, navigation, isFO = false) => {
      if (!getClientId() || !connected) {
        onCallError();
        return;
      }
      const stringeeUserId = getStringeeId(userId, isFO);
      const userIds = [stringeeUserId];
      const options = {
        name: name,
        isDistinct: true,
        isGroup: false,
      };
      client.current.createConversation(userIds, options, (status, code, message, data) => {
        logStringee('createConversation', {status, code, message, data});
        if (status) {
          navigation.navigate(ScreenIds.Chat, {
            conversationId: data.id,
            isGroup: data.isGroup,
            groupName: data.name,
            participants: data.participants,
          });
        }
      });
    },

    unRegisterPush,

    clearLocalDatabase: () => {
      if (!connected) {
        return;
      }
      client.current.clearDb((status, code, message) => {
        logStringee('clearDb', {status, code, message});
      });
    },

    liveChat,
    chat,
  };

  const makeCall = options => {
    if (!getClientId() || !connected) {
      onCallError();
      return;
    }
    stringeeRef.current?.makeCall(options);
  };

  const onCallError = () => {
    showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
  };

  return (
    <StringeeContext.Provider value={value}>
      {props.children}
      {!!token && (
        <WithStringeeClient
          ref={stringeeRef}
          stringeeClient={client}
          getClientId={getClientId}
          setConnected={setConnected}
          setDeviceToken={setDeviceToken}
          token={token}
          onObjectChange={chat.onObjectChange}
        />
      )}
      <StringeeClient
        ref={liveChat.client}
        eventHandlers={liveChat.eventHandlers}
        {...getServerAddresses()}
        stringeeXBaseUrl={getConfigs().stringee.PORTAL}
      />
    </StringeeContext.Provider>
  );
};

const useGetStringeeToken = ({notLoggedIn}) => {
  const userId = useSelector(getUserId);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({
    name: '',
    avatar: '',
    stringeeUserId: '',
  });

  const {startApi: startGetUserById} = useMutationGraphql({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
  });

  const {startApi: startGetStringeeToken} = useMutationGraphql({
    graphqlApiLazy: useGenerateStringeeAuthTokenMutation,
    dataField: 'generateStringeeAuthToken',
  });

  useEffect(() => {
    if (notLoggedIn) {
      setToken('');
    } else {
      getUserById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notLoggedIn]);

  const getUserById = () => {
    const variables: GetUserByIdQueryVariables = {
      userId: userId,
    };

    startGetUserById(
      {variables},
      (response: GetUserResponse) => {
        const userDto = response?.userDto;
        const value = userDto?.phoneNumber;
        if (value) {
          const stringeeUserId = getStringeeId('', true);
          setUser({
            phoneNumber: value,
            name: getUserFullName(userDto),
            avatar: userDto?.profilePhoto,
            stringeeUserId: getStringeeId(value, true),
          });
          getStringeeToken(stringeeUserId);
        }
      },
      () => {},
    );
  };

  const getStringeeToken = id => {
    const variables: GenerateStringeeAuthTokenMutationVariables = {
      payload: {
        target: id,
      },
    };
    startGetStringeeToken({variables}, (response: GenerateStringeeAuthTokenResponse) => {
      const authToken = response?.authToken;
      setToken(authToken);
    });
  };

  return {token, user};
};

const getStringeeId = (value, isFO = false) => {
  return `${isFO ? 'fo' : 'bo'}_${value}`;
};

export {StringeeContext, StringeeProvider};
