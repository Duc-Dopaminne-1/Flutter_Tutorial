import {useState} from 'react';

import {useGetUserFollowOnProjectsByProjectIdsLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

export const useGetFollowProjectIds = ({fetchFollowIdsSuccess = () => {}}) => {
  const [items, setItems] = useState([]);
  const {startApi} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useGetUserFollowOnProjectsByProjectIdsLazyQuery,
    dataField: 'getUserFollowOnProjectsByProjectIds',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: response => onSuccess(response),
  });

  const onSuccess = response => {
    const array: [UserFollowOnProjectDto] = response?.userFollowOnProjectDtos ?? [];
    const arrayIds = array.map(item => item?.projectId);
    setItems(arrayIds);
    fetchFollowIdsSuccess && fetchFollowIdsSuccess(arrayIds);
  };

  const fetchFollowIds = (projectIds: [string]) => {
    const variables: GetUserFollowOnProjectsByProjectIdsQueryVariables = {
      request: {
        projectIds: projectIds.join(','),
      },
    };
    startApi({variables});
  };

  return {fetchFollowProjectIds: fetchFollowIds, listFollowProjectIds: items};
};
