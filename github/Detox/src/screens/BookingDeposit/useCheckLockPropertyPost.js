import {useCheckLockPropertyPostForDepositeLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';

const useCheckLockPropertyPost = ({propertyPostId, onSuccess}) => {
  const onSuccessResponse = result => {
    onSuccess && onSuccess(result);
  };

  const {startApi: fetchCheckLockPropertyPost} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckLockPropertyPostForDepositeLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessResponse,
    dataField: 'checkLockPropertyPostForDeposite',
    showSpinner: true,
  });

  const checkLockPropertyPost = newId => {
    const input = newId ?? propertyPostId;
    fetchCheckLockPropertyPost({variables: {propertyPostId: input}});
  };

  return {checkLockPropertyPost};
};

export {useCheckLockPropertyPost};
