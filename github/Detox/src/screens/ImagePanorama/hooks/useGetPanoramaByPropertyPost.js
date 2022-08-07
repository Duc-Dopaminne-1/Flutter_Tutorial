import {useGetPanoramaByPropertyPostIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetPanoramaByPropertyPostId = onSuccess => {
  const {startApi: getSceneInfos} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPanoramaByPropertyPostIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getPanoramaByPropertyPostId',
    onSuccess: onSuccess,
    showSpinner: false,
  });

  const startGetPanoramaByPropertyPostId = propertyPostId => {
    getSceneInfos({variables: {propertyPostId}});
  };

  return [startGetPanoramaByPropertyPostId];
};

export default useGetPanoramaByPropertyPostId;
