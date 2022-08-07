import {useGetContactTradingsForC2CDemandLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {useMount} from '../../commonHooks';

export const useGetContactTradingsForC2CDemand = (variables = {}) => {
  const {
    startApi: getContactTradingsForC2CDemand,
    data,
    loading,
  } = useGraphqlApiLazy({
    graphqlApiLazy: useGetContactTradingsForC2CDemandLazyQuery,
    dataField: 'getContactTradingsForC2CDemand',
    queryOptions: {},
    showSpinner: true,
    onSuccess: () => {},
    onError: () => {},
  });

  useMount(() => {
    onRefresh();
  });

  const onRefresh = () => {
    getContactTradingsForC2CDemand({variables});
  };

  return {
    data: data,
    loading,
  };
};
