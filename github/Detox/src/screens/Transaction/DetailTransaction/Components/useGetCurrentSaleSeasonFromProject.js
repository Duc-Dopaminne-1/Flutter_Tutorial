import {useGetSaleSeasonFromProjectByIdLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../../assets/constants';

const useGetCurrentSaleSeasonFromProject = ({projectId, onSuccess, onError}) => {
  const onSuccessGetCurrentSaleSeason = result => {
    onSuccess && onSuccess(result?.foProjectById?.saleSeasonInfo);
  };

  const {startApi: fetchSaleSeasonFromProject} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSaleSeasonFromProjectByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetCurrentSaleSeason,
    onError: onError,
    showSpinner: false,
  });

  const getSaleSeasonFromProject = newProjectId => {
    const input = newProjectId ?? projectId;
    input && fetchSaleSeasonFromProject({variables: {projectId: input}});
  };

  return {getSaleSeasonFromProject};
};

export default useGetCurrentSaleSeasonFromProject;
