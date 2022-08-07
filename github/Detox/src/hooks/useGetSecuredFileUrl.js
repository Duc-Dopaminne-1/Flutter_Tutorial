import {
  GetSecuredFileUrlQueryVariables,
  GetSecuredFileUrlResponse,
  useGetSecuredFileUrlLazyQuery,
} from '../api/graphql/generated/graphql';
import {useMutationGraphql} from '../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../assets/constants';

export const useGetSecuredFileUrl = () => {
  const {startApi: getFileUrl} = useMutationGraphql({
    graphqlApiLazy: useGetSecuredFileUrlLazyQuery,
    dataField: 'getSecuredFileUrl',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    showSpinner: false,
  });

  return (url: String) => {
    return new Promise(resolve => {
      const variables: GetSecuredFileUrlQueryVariables = {
        payload: {url: url},
      };
      getFileUrl(
        {variables},
        (response: GetSecuredFileUrlResponse) => {
          resolve(response?.securedUrl);
        },
        () => {},
      );
    });
  };
};
