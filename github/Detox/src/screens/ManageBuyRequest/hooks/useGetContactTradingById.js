import {useC2CContactTradingByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const useGetContactTradingById = ({onSuccessResponse = () => {}}) => {
  const onSuccessGetContactTradingInfo = response => {
    const data = response?.contactTrading;
    const payload = {
      assigneeId: data?.assigneeId ?? '',
      propertyPostId: data?.propertyPostId ?? '',
      contactTradingInfo: data ?? {},
    };
    onSuccessResponse(payload);
  };
  const {startApi: getContactTradingByIdQuery, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useC2CContactTradingByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'c2cContactTradingById',
    onSuccess: onSuccessGetContactTradingInfo,
    showSpinner: false,
  });

  const getContactTradingById = contactId => {
    getContactTradingByIdQuery({variables: {contactTradingId: contactId}});
  };

  return {getContactTradingById, loading};
};

export default useGetContactTradingById;
