import {useEffect} from 'react';

import {useGetServiceTicketByIdForFrontOfficeLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../../assets/constants';
import {useGetRequestPaymentDetail} from '.';

const useGetDetailSupportServices = ({
  ticketId,
  propertyPostId,
  transactionType,
  TransactionType,
  onSuccess,
}) => {
  const {getRequestPaymentDetail, transactionDetail} = useGetRequestPaymentDetail();

  const startGetPaymentDetail = () => {
    if (propertyPostId) {
      getRequestPaymentDetail({
        transactionType: transactionType ?? TransactionType.Supportservice,
        userTransactionId: ticketId,
        propertyPostId,
      });
    }
  };
  useEffect(startGetPaymentDetail, [propertyPostId]);

  const {startApi: detailRequestSupport} = useGraphqlApiLazy({
    graphqlApiLazy: useGetServiceTicketByIdForFrontOfficeLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'getServiceTicketByIdForFrontOffice',
    onSuccess: data => {
      onSuccess && onSuccess(data);
    },
  });

  const getDetailTicket = () => {
    if (ticketId) {
      detailRequestSupport({
        variables: {
          SupportServiceTicketId: ticketId,
        },
      });
    }
  };

  return {getDetailTicket, transactionDetail};
};
export default useGetDetailSupportServices;
