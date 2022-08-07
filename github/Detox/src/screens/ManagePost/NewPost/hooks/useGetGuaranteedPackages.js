import {useGetGuaranteedPackagesLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../../assets/constants';

const useGetGuaranteedPackages = ({onSuccess}) => {
  const {startApi: getGuaranteedPackagesQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetGuaranteedPackagesLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'guaranteedPackages',
    onSuccess: res => {
      onSuccess && onSuccess(res?.edges ?? []);
    },
  });

  return {getGuaranteedPackagesQuery};
};

export default useGetGuaranteedPackages;
