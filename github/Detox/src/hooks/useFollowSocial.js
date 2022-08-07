import {useContext, useState} from 'react';

import {
  useFollowFeedItemMutation,
  useGetTotalFollowerByFeedObjectIdForFrontOfficeLazyQuery,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../appData/appContext/appContext';
import {FETCH_POLICY} from '../assets/constants';
import {useLogin} from '../screens/Auth/useLogin';
import {useMount} from '../screens/commonHooks';
import {getCommentObjectType} from '../utils/GetMasterData';

const useFollowSocial = ({feedObjectId, feedObjectTypeId, onFollowTopenerSuccess}) => {
  const [followInfo, setFollowInfo] = useState({});
  const {showLogin} = useLogin();
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const {typeId} = getCommentObjectType(masterData, feedObjectTypeId);

  const {startApi: getTotalFollow} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTotalFollowerByFeedObjectIdForFrontOfficeLazyQuery,
    dataField: 'getTotalFollowerByFeedObjectIdForFrontOffice',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    onSuccess: data => {
      setFollowInfo(data);
    },
    onError: () => {},
    showSpinner: false,
  });

  const {startApi} = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useFollowFeedItemMutation,
  });

  useMount(() => {
    getTotalFollow({
      variables: {
        feedObjectId: feedObjectId,
      },
    });
  });

  const onFollowTopener = ({feedObjectTitle}) => {
    showLogin(() => {
      const totalFollow = followInfo.totalFollower;
      const isFollow = followInfo.currentUserFollowFeedItem;
      setFollowInfo(prev => ({
        ...prev,
        ...(prev.totalFollower = isFollow ? totalFollow - 1 : totalFollow + 1),
        ...(prev.currentUserFollowFeedItem = !isFollow),
      }));
      startApi(
        {
          variables: {
            input: {
              feedObjectId: feedObjectId,
              feedObjectTypeId: typeId,
              feedObjectTitle: feedObjectTitle,
              isFollowFeedItem: !isFollow,
            },
          },
        },
        () => {
          onFollowTopenerSuccess();
        },
      );
    });
  };

  return {
    followInfo,
    onFollowTopener,
  };
};

export default useFollowSocial;
