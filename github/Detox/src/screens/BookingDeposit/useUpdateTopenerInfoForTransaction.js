import {
  UpdateTopenerInfoForTransactionInput,
  useUpdateTopenerInfoForTransactionMutation,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';

const useUpdateTopenerInfoForTransaction = ({onSuccess}) => {
  const onSuccessResponse = data => {
    onSuccess && onSuccess(data);
  };

  const {startApi: updateTopenerInfoForTransaction} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateTopenerInfoForTransactionMutation,
    dataField: 'updateTopenerInfoForTransaction',
    onSuccess: onSuccessResponse,
    showSpinner: true,
  });

  const updateTopenerInfoTransaction = (info: UpdateTopenerInfoForTransactionInput) => {
    updateTopenerInfoForTransaction({
      variables: {
        input: info,
      },
    });
  };

  return {updateTopenerInfoTransaction};
};

export {useUpdateTopenerInfoForTransaction};
