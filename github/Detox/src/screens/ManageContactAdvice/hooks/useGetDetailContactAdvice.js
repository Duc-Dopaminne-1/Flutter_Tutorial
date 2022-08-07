import {
  GetSupportRequestExactByIdQueryVariables,
  useGetSupportRequestExactByIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {useMount} from '../../commonHooks';

export const useGetDetailContactAdvice = requestId => {
  const {
    startApi: getDetail,
    loading,
    data,
  } = useGraphqlApiLazy({
    graphqlApiLazy: useGetSupportRequestExactByIdLazyQuery,
    dataField: 'supportRequestExactById',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    showSpinner: true,
  });

  useMount(() => {
    onRefresh();
  });

  const onRefresh = () => {
    const variables: GetSupportRequestExactByIdQueryVariables = {
      input: requestId,
    };
    getDetail({variables});
  };

  return {
    data,
    loading,
    onRefresh,
  };
};
