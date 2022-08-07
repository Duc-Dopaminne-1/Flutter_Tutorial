import {useGetPanoramaByCodeLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetPanoramaByCode = onSuccess => {
  const {startApi: getPanoramaByCode} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPanoramaByCodeLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getPanoramaByCode',
    onSuccess,
    showSpinner: false,
  });

  const startGetPanoramaByCode = panoramaImageCode => {
    getPanoramaByCode({variables: {panoramaImageCode}});
  };

  return [startGetPanoramaByCode];
};

export default useGetPanoramaByCode;
