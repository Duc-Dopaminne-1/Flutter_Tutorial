import {useState} from 'react';

import {
  GetServiceTicketByIdForFrontOfficeResponse,
  useGetServiceTicketByIdForFrontOfficeLazyQuery,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../assets/constants';
import logService from '../service/logService';

type UseGetServiceTicketByIdProps = {
  onSuccess: (data: GetServiceTicketByIdForFrontOfficeResponse) => {},
};

const useGetServiceTicketById = ({onSuccess}: UseGetServiceTicketByIdProps) => {
  const [lastId, setLastId] = useState('');
  const [, setPostId] = useState(''); // TODO: integrate getPropertyPostById

  const onSuccessGetInfo = (data: GetServiceTicketByIdForFrontOfficeResponse) => {
    if (data.errorCode === 0) {
      const propertyPostId = data.supportServiceTicket?.propertyPostId ?? '';
      if (propertyPostId) {
        setPostId(propertyPostId);
      }
      onSuccess && onSuccess(data);
    } else {
      logService.log('getServiceTicketById error === ', data.errorMessage);
    }
  };

  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetServiceTicketByIdForFrontOfficeLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetInfo,
    showSpinner: false,
  });

  const getServiceTicketById = id => {
    if (id) {
      setLastId(id);
      startApi({variables: {SupportServiceTicketId: id}});
    }
  };

  const onRefresh = () => {
    if (lastId) {
      startApi({variables: {SupportServiceTicketId: lastId}});
    }
  };

  return {getServiceTicketById, loading, onRefresh};
};

export default useGetServiceTicketById;
