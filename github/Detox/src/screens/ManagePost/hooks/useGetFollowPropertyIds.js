import {useState} from 'react';

import {useGetUserFollowOnPostsByPropertyPostIdsLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

export const useGetFollowPropertyIds = () => {
  const [items, setItems] = useState([]);
  const {startApi} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useGetUserFollowOnPostsByPropertyPostIdsLazyQuery,
    dataField: 'getUserFollowOnPostsByPropertyPostIds',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: response => onSuccess(response),
  });

  const onSuccess = response => {
    const array: [UserFollowOnPropertyDto] = response?.userFollowOnPostDtos ?? [];
    const arrayIds = array.map(item => item?.propertyPostId);
    setItems(arrayIds);
  };

  const fetchFollowIds = (propertyIds: [string]) => {
    const variables: GetUserFollowOnPostsByPropertyPostIdsQueryVariables = {
      input: {
        propertyPostIds: propertyIds.join(','),
      },
    };
    startApi({variables});
  };

  return {fetchFollowPropertyIds: fetchFollowIds, listFollowPropertyIds: items};
};
