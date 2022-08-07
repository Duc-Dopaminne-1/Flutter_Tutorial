import {useGetSummaryPropertyPostLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';

const useGetSummaryPropertyPosts = ({onSuccess, onError, showSpinner}) => {
  const {startApi: getSummaryPropertyPosts} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSummaryPropertyPostLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'summaryPropertyPosts',
    onSuccess,
    onError,
    showSpinner,
  });

  return {getSummaryPropertyPosts};
};

export {useGetSummaryPropertyPosts};
