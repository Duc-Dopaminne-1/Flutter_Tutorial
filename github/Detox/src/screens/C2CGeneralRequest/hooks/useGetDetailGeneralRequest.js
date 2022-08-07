import {useGetTopenerReadC2CDemandMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {useMount} from '../../commonHooks';

export const useGetDetailGeneralRequest = c2CDemandId => {
  const {
    startApi: getC2CDemand,
    data,
    loading,
  } = useGraphqlApiLazy({
    graphqlApiLazy: useGetTopenerReadC2CDemandMutation,
    dataField: 'topenerReadC2CDemand',
    queryOptions: {},
    showSpinner: true,
    onSuccess: () => {},
    onError: () => {},
  });

  useMount(() => {
    onRefresh();
  });

  const onRefresh = () => {
    if (c2CDemandId) {
      const variables = {
        c2CDemandId,
      };
      getC2CDemand({variables});
    }
  };

  return {
    data: data ?? null,
    loading,
    onRefresh,
  };
};
