import {
  GetDefaultAgentGroupQueryVariables,
  useGetAgentGroupsLazyQuery,
  useGetDefaultAgentGroupLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';

const useGetAgentGroups = ({onSuccess, showSpinner}) => {
  const {startApi: getAgentGroups, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentGroupsLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'agentGroups',
    onSuccess,
    showSpinner: showSpinner,
  });

  const getAgentGroupsLevel1 = () => {
    const whereCondition = {where: {agentGroupLevel: 1}};
    getAgentGroups({variables: whereCondition});
  };

  const getAllAgentGroups = () => {
    const whereCondition = {where: null};
    getAgentGroups({variables: whereCondition});
  };

  return {getAgentGroupsLevel1, getAllAgentGroups, loading};
};

const useGetDefaultAgentGroup = ({onSuccess}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetDefaultAgentGroupLazyQuery,
    dataField: 'defaultAgentGroup',
    onSuccess: data => {
      onSuccess({id: data?.agentGroupId, name: data?.agentGroupDescription});
    },
  });

  const getDefaultAgentGroup = () => {
    const variables: GetDefaultAgentGroupQueryVariables = {};
    startApi({variables});
  };

  return {
    getDefaultAgentGroup,
  };
};

export {useGetAgentGroups, useGetDefaultAgentGroup};
