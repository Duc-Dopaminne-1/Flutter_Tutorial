import {useState} from 'react';

import {
  CreateSupportRequestFromContactTradingDetailResponse,
  SupportRequestsFoContactTradingResponse,
  useCreateSupportRequestFromContactTradingDetailMutation,
  useGetSupportRequestsFoByContactTradingIdLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

export const useGetSupportRequestsByContactTradingId = () => {
  const [requests, setRequests] = useState([]);

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSupportRequestsFoByContactTradingIdLazyQuery,
    dataField: 'supportRequestsFOByContactTradingId',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: (data: SupportRequestsFoContactTradingResponse) => {
      if (data.errorCode === 0) {
        setRequests(data.supportRequestContactTradingDtos);
      }
    },
  });

  const getSupportRequestsByCT = id => {
    startApi({variables: {contactTradingId: id}});
  };

  return {
    getSupportRequestsByCT,
    requests,
  };
};

export const useCreateSupportRequestFromCT = ({onSuccess, showSpinner = true}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateSupportRequestFromContactTradingDetailMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'createSupportRequestFromContactTradingDetail',
    onSuccess: (data: CreateSupportRequestFromContactTradingDetailResponse) => {
      if (data.errorCode === 0) {
        onSuccess && onSuccess(data.supportRequestId);
      }
    },
    showSpinner,
  });

  const createSupportRequest = ({contactTradingId, requestDescription, requestTypeId}) => {
    startApi({variables: {input: {contactTradingId, requestDescription, requestTypeId}}});
  };

  return {
    createSupportRequest,
  };
};
