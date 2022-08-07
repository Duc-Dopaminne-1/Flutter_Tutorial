import {useGetUsersForMessengerLazyQuery} from '../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';
import {IParticipant} from './types';

const PREFIX_ID = '_';

export const useGetUsers = () => {
  const {startApi: startApiGetUsers} = useMutationGraphql({
    graphqlApiLazy: useGetUsersForMessengerLazyQuery,
    dataField: 'getUsersForMessenger',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
  });

  const getUsersForConversations = (items, onSuccess) => {
    if (items.length === 0) {
      onSuccess(items);
      return;
    }
    const userIds = getUserIds(items);
    const variables: GetUsersForMessengerQueryVariables = {
      request: {uniqueIds: userIds},
    };
    startApiGetUsers({variables}, response => {
      const users: [] = response.users;
      const newItems = items.map(value => {
        return {
          ...value,
          ...getUserById(value.userId, users),
          participants: value.participants.map(participant => ({
            ...participant,
            ...getUserById(participant.userId, users),
          })),
        };
      });
      onSuccess(newItems);
    });
  };

  const getUsersForParticipants = (items, onSuccess) => {
    if (items.length === 0) {
      onSuccess(items);
      return;
    }
    const userIds = getUserIds(items);
    const variables: GetUsersForMessengerQueryVariables = {
      request: {uniqueIds: userIds},
    };
    startApiGetUsers({variables}, response => {
      const users: [] = response.users;
      const newItems = items.map(value => {
        return {
          ...value,
          ...getUserById(value.userId, users),
        };
      });
      onSuccess(newItems);
    });
  };

  return {
    getUsersForConversations,
    getUsersForParticipants,
  };
};

const getUserIds = items => {
  return items.map(value => value.userId.split(PREFIX_ID)[1]).join(',');
};

const getUserById = (id, users) => {
  const array = users
    .filter(user => user.phoneNumber === id.split(PREFIX_ID)[1])
    .map(value => {
      const roleNames = value?.roleNames.split(',') ?? [];
      const isAgent = roleNames?.findIndex(role => role === 'agent') !== -1;
      const isMember = roleNames?.findIndex(role => role === 'member') !== -1;
      const participant: IParticipant = {
        agentId: value.userId,
        name: value.fullName,
        avatar: value.profilePhoto,
        isAgent,
        isMember,
        roleNames,
      };
      return participant;
    });
  return array[array.length - 1];
};
