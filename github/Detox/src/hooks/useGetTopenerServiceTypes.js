import {useGetTopenerServiceRequestTypesLazyQuery} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {useMount} from '../screens/commonHooks';

export const useGetTopenerServiceTypes = onSuccess => {
  const {startApi, data} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTopenerServiceRequestTypesLazyQuery,
    dataField: 'topenerServiceRequestTypes',
    onSuccess: response => {
      onSuccess?.(extractData(response));
    },
  });

  useMount(() => {
    startApi();
  });

  return {
    data: extractData(data),
  };
};

function extractData(data) {
  return (data?.edges ?? []).map(item => ({
    id: item?.requestTypeId,
    name: item?.requestTypeName,
    description: item?.requestTypeDescription,
  }));
}
