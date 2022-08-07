import {useGetStreetByCityAndDistrictLazyQuery} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../assets/constants';

export const useGetStreets = ({onSuccess}) => {
  const onSuccessResponse = data => {
    const result = data?.edges ?? [];
    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  const {startApi: getStreetByCityDistrict} = useGraphqlApiLazy({
    graphqlApiLazy: useGetStreetByCityAndDistrictLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'streets',
    onSuccess: onSuccessResponse,
  });

  const getStreets = where => {
    getStreetByCityDistrict({variables: where});
  };

  return {getStreets};
};
