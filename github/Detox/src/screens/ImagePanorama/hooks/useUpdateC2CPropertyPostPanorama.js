import {useUpdateC2CPropertyPostPanoramaMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useUpdateC2CPropertyPostPanorama = ({onSuccess}) => {
  const {startApi: updateC2CPropertyPostPanorama} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CPropertyPostPanoramaMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'updateC2CPropertyPostPanorama',
    onSuccess,
    showSpinner: true,
  });

  const startUpdateC2CPropertyPostPanorama = (panoramaImageId, panoramaJson) => {
    const query = {
      variables: {
        input: {
          panoramaImageId,
          panoramaJson,
        },
      },
    };
    updateC2CPropertyPostPanorama(query);
  };

  return [startUpdateC2CPropertyPostPanorama];
};

export default useUpdateC2CPropertyPostPanorama;
