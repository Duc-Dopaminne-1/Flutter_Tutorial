import {useContext, useRef, useState} from 'react';

import {
  ExecutorSubmitServiceTicketResultInput,
  GetServiceTicketByIdForFrontOfficeResponse,
  GetServiceTicketResultByIdForFrontOfficeResponse,
  GetUserTransactionByIdResponse,
  PaymentMethod,
  PaymentUnit,
  PropertyPostDto,
  RequesterAcceptServiceTicketResultResponse,
  RequesterRejectServiceTicketResultResponse,
  SupportServiceTicketForFrontOfficeDto,
  TransactionServiceType,
  TransactionType,
  useChangeStateOfServiceTicketForFrontOfficeMutation,
  useExecutorSubmitServiceTicketResultMutation,
  useGetPropertyPostByIdLazyQuery,
  useGetServiceTicketByIdForFrontOfficeLazyQuery,
  useGetServiceTicketResultByIdForFrontOfficeLazyQuery,
  useGetUserTransactionDetailLazyQuery,
  usePayTransactionMutation,
  useRequesterAcceptServiceTicketResultMutation,
  useRequesterRejectServiceTicketResultMutation,
  UserTransactionDto,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../../appData/appContext/appContext';
import {
  FETCH_POLICY,
  SUPPORT_SERVICE_TICKET_STATUSES_BY_NAME_TO_ID,
} from '../../../../assets/constants';
import logService from '../../../../service/logService';
import {GetPaymentInfoInput} from '../type';

export const usePaySupportService = () => {
  const successCallback = useRef();
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: usePayTransactionMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'payTransaction',
    onSuccess: res => {
      successCallback.current && successCallback.current(res);
    },
    showSpinner: true,
  });

  const getPayTransactionInfo = ({
    info,
    onSuccess,
  }: {
    info: GetPaymentInfoInput,
    onSuccess: Function,
  }) => {
    successCallback.current = onSuccess;

    const {ticketId, propertyPostId, userId, executorId, amount, supportTypeId} = info;

    startApi({
      variables: {
        input: {
          transactionId: ticketId,
          propertyPostId,
          userId,
          consultantId: executorId,
          amount,
          transactionType: TransactionType.Supportservice,
          transactionServiceType: TransactionServiceType.Supportservicetype,
          paymentUnit: PaymentUnit.Vnpay,
          paymentMethod: PaymentMethod.Ewallet,
          supportTypeId: supportTypeId,
          locale: 'vn',
        },
      },
    });
  };

  return {
    getPayTransactionInfo,
  };
};

export const useRequestRefundSupportRequest = () => {
  const successCallback = useRef();
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: usePayTransactionMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'payTransaction',
    onSuccess: res => {
      successCallback.current && successCallback.current(res);
    },
    showSpinner: true,
  });

  const requestRefund = ({info, onSuccess}: {info: GetPaymentInfoInput, onSuccess: Function}) => {
    successCallback.current = onSuccess;

    const {
      ticketId,
      propertyPostId,
      userId,
      executorId,
      amount,
      supportTypeId,
      paymentUnit = PaymentUnit.Vnpay,
      paymentCode,
      requestNoted,
    } = info;

    startApi({
      variables: {
        input: {
          transactionId: ticketId,
          paymentCode,
          requestNoted,
          propertyPostId,
          userId,
          consultantId: executorId,
          amount,
          transactionType: TransactionType.Refund,
          transactionServiceType: TransactionServiceType.Supportservicetype,
          paymentUnit,
          paymentMethod: PaymentMethod.Ewallet,
          supportTypeId: supportTypeId,
          locale: 'vn',
        },
      },
    });
  };

  return {
    requestRefund,
  };
};

export const useChangeTicketState = () => {
  const successCallback = useRef();
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useChangeStateOfServiceTicketForFrontOfficeMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'changeStateOfServiceTicketForFrontOffice',
    onSuccess: res => {
      successCallback.current && successCallback.current(res);
    },
    showSpinner: true,
  });

  const beginToExecuteTicket = ({ticketId, onSuccess}) => {
    successCallback.current = onSuccess;
    startApi({
      variables: {
        input: {
          supportServiceTicketId: ticketId,
          nextStateId: SUPPORT_SERVICE_TICKET_STATUSES_BY_NAME_TO_ID.Processing,
          reasonId: '',
          reasonNote: '',
        },
      },
    });
  };

  return {
    beginToExecuteTicket,
  };
};

export const useExecutorSubmitTicketResult = ({onSuccess = () => {}, onError}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useExecutorSubmitServiceTicketResultMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'executorSubmitServiceTicketResult',
    onSuccess: res => {
      onSuccess && onSuccess(res);
    },
    onError: error => {
      onError && onError(error);
    },
    showSpinner: true,
  });

  const submitTicketResult = (data: ExecutorSubmitServiceTicketResultInput) => {
    startApi({
      variables: {
        input: data,
      },
    });
  };

  return {
    submitTicketResult,
  };
};

const useGetPropertyPostById = ({onSuccess}: {onSuccess: (data: PropertyPostDto) => {}}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPropertyPostByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'propertyPostById',
    onSuccess: (data: PropertyPostDto) => {
      onSuccess && onSuccess(data);
    },
    onError: () => {},
  });

  const getPostInfo = id => {
    startApi({
      variables: {
        propertyPostId: id,
      },
    });
  };

  return {
    getPostInfo,
  };
};

export const useGetServiceTicketById = () => {
  const {showErrorAlert} = useContext(AppContext);
  const [lastId, setLastId] = useState('');
  const [postInfo, setPostInfo]: [PropertyPostDto, Function] = useState();
  const [ticketInfo, setTicketInfo]: [SupportServiceTicketForFrontOfficeDto, Function] = useState();

  const {getPostInfo} = useGetPropertyPostById({
    onSuccess: data => {
      setPostInfo(data);
    },
  });

  const onSuccessGetInfo = (data: GetServiceTicketByIdForFrontOfficeResponse) => {
    if (data.errorCode === 0) {
      const propertyPostId = data.supportServiceTicket?.propertyPostId ?? '';
      if (propertyPostId) {
        getPostInfo(propertyPostId);
      }
      setTicketInfo(data.supportServiceTicket);
    } else {
      showErrorAlert(data?.errorMessage);
      logService.log('getServiceTicketById error === ', data.errorMessage);
    }
  };

  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetServiceTicketByIdForFrontOfficeLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getServiceTicketByIdForFrontOffice',
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

  return {getServiceTicketById, loading, onRefresh, postInfo, ticketInfo};
};

export const useRequesterAcceptTicketResult = ({
  onSuccess,
}: {
  onSuccess: (res: RequesterAcceptServiceTicketResultResponse) => {},
}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useRequesterAcceptServiceTicketResultMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'requesterAcceptServiceTicketResult',
    onSuccess: (res: RequesterAcceptServiceTicketResultResponse) => {
      onSuccess && onSuccess(res);
    },
    showSpinner: true,
  });

  const acceptTicketResult = (id: String) => {
    startApi({
      variables: {
        input: {
          supportServiceTicketResultId: id,
        },
      },
    });
  };

  return {
    acceptTicketResult,
  };
};

export const useRequesterRejectTicketResult = ({
  onSuccess,
}: {
  onSuccess: (res: RequesterRejectServiceTicketResultResponse) => {},
}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useRequesterRejectServiceTicketResultMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'requesterRejectServiceTicketResult',
    onSuccess: (res: RequesterRejectServiceTicketResultResponse) => {
      onSuccess && onSuccess(res);
    },
    showSpinner: true,
  });

  const rejectTicketResult = (id: String, reasonNote: String, reasonId: String) => {
    startApi({
      variables: {
        input: {
          supportServiceTicketResultId: id,
          reasonId,
          reasonNote,
        },
      },
    });
  };

  return {
    rejectTicketResult,
  };
};

export const useGetSupportRequestTicketResultById = ({
  onSuccess,
}: {
  onSuccess: (res: GetServiceTicketResultByIdForFrontOfficeResponse) => {},
}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetServiceTicketResultByIdForFrontOfficeLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getServiceTicketResultByIdForFrontOffice',
    onSuccess: (res: GetServiceTicketResultByIdForFrontOfficeResponse) => {
      onSuccess && onSuccess(res);
    },
    showSpinner: true,
  });

  const getServiceTicketResult = id => {
    startApi({
      variables: {
        SupportServiceTicketResultId: id,
      },
    });
  };

  return {
    getServiceTicketResult,
  };
};

export const useGetRequestPaymentDetail = () => {
  const successCallback = useRef();
  const [transactionDetail, setTransactionDetail]: [UserTransactionDto, Funtion] = useState();

  const {startApi: getUserTransactionDetailQuery} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserTransactionDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userTransactionById',
    onSuccess: (data: GetUserTransactionByIdResponse) => {
      if (data.errorCode === 0) {
        setTransactionDetail(data.userTransactionDto);
        successCallback.current && successCallback.current(data.userTransactionDto);
      }
    },
    onError: () => {},
  });

  const getRequestPaymentDetail = ({
    transactionType,
    userTransactionId,
    propertyPostId,
    onSuccess,
  }: {
    transactionType: TransactionServiceType,
    userTransactionId: String,
    propertyPostId: String,
    onSuccess: (data: UserTransactionDto) => {},
  }) => {
    successCallback.current = onSuccess;
    getUserTransactionDetailQuery({
      variables: {
        input: {
          transactionType,
          userTransactionId,
          propertyPostId,
        },
      },
    });
  };

  return {
    getRequestPaymentDetail,
    transactionDetail,
  };
};
