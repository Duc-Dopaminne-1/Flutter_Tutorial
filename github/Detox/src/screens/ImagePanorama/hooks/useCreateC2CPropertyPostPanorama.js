import {useCreatePanoramaForC2CPropertyPostMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useCreateC2CPropertyPostPanorama = ({onSuccess}) => {
  const {startApi: CreatePanoramaForC2CPropertyPost} = useGraphqlApiLazy({
    graphqlApiLazy: useCreatePanoramaForC2CPropertyPostMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'createPanoramaForC2CPropertyPost',
    onSuccess,
    showSpinner: true,
  });

  const startCreateC2CPropertyPostPanorama = (propertyPostId, panoramaJson) => {
    const query = {
      variables: {
        input: {
          propertyPostId,
          panoramaJson,
        },
      },
    };
    CreatePanoramaForC2CPropertyPost(query);
  };

  return [startCreateC2CPropertyPostPanorama];
};

export default useCreateC2CPropertyPostPanorama;
