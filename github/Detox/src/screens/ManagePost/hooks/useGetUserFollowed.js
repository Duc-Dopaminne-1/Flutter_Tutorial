import {
  GetUserFollowOnPostsByPropertyPostIdsQueryVariables,
  GetUserFollowOnPostsByPropertyPostIdsResponse,
  useGetUserFollowOnPostsByPropertyPostIdsLazyQuery,
  UserFollowOnPostDto,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';

export const useGetUserFollowed = () => {
  const {startApi} = useMutationGraphql({
    graphqlApiLazy: useGetUserFollowOnPostsByPropertyPostIdsLazyQuery,
    dataField: 'getUserFollowOnPostsByPropertyPostIds',
  });

  const getListUserFollowed = (
    listProperty: Array = [],
    onSuccess: ([UserFollowOnPostDto]) => {},
  ) => {
    const propertyPostIds = (listProperty ?? []).map(item => item?.propertyPostId).toString();
    const variables: GetUserFollowOnPostsByPropertyPostIdsQueryVariables = {
      input: {
        propertyPostIds,
      },
    };
    startApi(
      {
        variables,
      },
      (response: GetUserFollowOnPostsByPropertyPostIdsResponse) => {
        const data = response?.userFollowOnPostDtos;
        onSuccess(data);
      },
    );
  };

  return {
    getListUserFollowed,
  };
};
