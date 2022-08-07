import {useContext, useState} from 'react';

import {
  ApproveContactTradingB2CResponse,
  CreateContactTradingB2CInput,
  CreateContactTradingB2CResponse,
  useApproveContactTradingB2CMutation,
  useCheckContactTradingB2CNotificationLazyQuery,
  useCreateContactTradingB2CMutation,
  useDeclineContactTradingB2CMutation,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../assets/constants';
import {translate} from '../assets/localize';
import {callAfterInteraction} from '../screens/commonHooks';
import {rootNavigationRef} from '../screens/navigate';
import ScreenIds from '../screens/ScreenIds';
import {CreateContactRequestInput} from './useContactToBuy';

export const useContactTradingB2C = ({onSubmitSuccess}) => {
  const [id, setId] = useState(null);

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateContactTradingB2CMutation,
    dataField: 'createContactTradingB2C',
    onSuccess: (response: CreateContactTradingB2CResponse) => {
      setId(response?.contactTradingB2CId);
      callAfterInteraction(onSubmitSuccess);
    },
    showSpinner: true,
  });

  const createContactTradingB2C = (input: CreateContactRequestInput) => {
    const requestInput: CreateContactTradingB2CInput = {
      propertyPostId: input.propertyPost?.propertyPostId,
      tokenCaptcha: input.tokenCaptcha,
    };

    if (input.isMe) {
      requestInput.isRequesterAgency = true;
    } else {
      requestInput.isRequesterAgency = false;
      requestInput.customerEmail = input.customerEmail;
      requestInput.customerFullName = input.customerFullName;
      requestInput.customerPhoneNumber = input.customerPhoneNumber;
    }

    if (input.serviceIds) {
      requestInput.supportRequestServiceBonusIds = JSON.stringify(input.serviceIds);
    }

    startApi({
      variables: {
        input: requestInput,
      },
    });
  };

  return {
    createContactTradingB2C,
    id,
  };
};

export const useApproveContactTrading = () => {
  const {showErrorAlert} = useContext(AppContext);

  const {startApi: approve} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useApproveContactTradingB2CMutation,
    dataField: 'approveContactTradingB2C',
  });

  const {startApi: decline} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useDeclineContactTradingB2CMutation,
    dataField: 'declineContactTradingB2C',
  });

  return (
    //format
    isApprove = true,
    notificationId,
    onDone: (contactTradingB2CId?: String) => {},
  ) => {
    const input = {
      variables: {
        input: {
          notificationId: notificationId,
        },
      },
    };

    const onSuccess = (response: ApproveContactTradingB2CResponse) => {
      onDone();
      if (isApprove) {
        const contactTradingB2CId = response?.contactTradingB2CId;
        rootNavigationRef?.current?.push(ScreenIds.RequestDetailStack, {
          screen: ScreenIds.RequestDetail,
          params: {
            requestId: contactTradingB2CId,
            isSending: false,
            isB2C: true,
          },
        });
      }
    };

    const onError = error => {
      showErrorAlert(error.message, () => {
        onDone();
      });
    };

    if (isApprove) {
      approve(input, onSuccess, onError);
    } else {
      decline(input, onSuccess, onError);
    }
  };
};

export const useCheckContactTradingB2CNotification = () => {
  const {showAppModal, showErrorAlert} = useContext(AppContext);
  const approveContactTrading = useApproveContactTrading();

  const {startApi} = useMutationGraphql({
    graphqlApiLazy: useCheckContactTradingB2CNotificationLazyQuery,
    dataField: 'checkContactTradingB2CNotification',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    showSpinner: true,
  });

  const showConfirmAlert = (notificationId, message, onDone) => {
    showAppModal({
      isVisible: true,
      title: translate('common.newContactTrading'),
      message,
      cancelText: translate('common.decline'),
      okText: translate('common.approve'),
      onCancelHandler: () => {
        approveContactTrading(false, notificationId, onDone);
      },
      onOkHandler: () => {
        approveContactTrading(true, notificationId, onDone);
      },
    });
  };

  return (notificationId, message, onDone) => {
    startApi(
      {
        variables: {notificationId: notificationId},
      },
      () => {
        showConfirmAlert(notificationId, message, onDone);
      },
      error => {
        showErrorAlert(error.message, onDone);
      },
    );
  };
};
