import {useContext} from 'react';
import {useSelector} from 'react-redux';

import {
  ContactTradingInfoInput,
  CreateContactTradingInput,
  useCreateC2CContactTradingFoMutation,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../appData/appContext/useAppContext';
import {isAgent} from '../appData/user/selectors';
import {FETCH_POLICY, getGenderEnum} from '../assets/constants';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import {STRINGS} from '../assets/localize/string';
import {callAfterInteraction} from '../screens/commonHooks';
import {getUserFullName} from '../utils/UserAgentUtil';

export type CreateContactRequestInput = {
  serviceIds: string[],
  propertyPost: Object[],
  isMe: Boolean,
  user: string,
  customerEmail: string,
  customerFullName: string,
  customerPhoneNumber: string,
  agentInfo: Object,
  tokenCaptcha: string,
};

const mapCreateContactTradingInput = ({
  isAgentUser,
  serviceIds,
  propertyPost,
  user,
  customerEmail,
  customerFullName,
  customerPhoneNumber,
  agentInfo,
  tokenCaptcha,
  contactType,
  requesterIsBuyer,
}) => {
  const {
    email: requesterEmail,
    gender: userGender,
    phoneNumber: requesterPhoneNumber,
    userId: requesterId,
  } = user ?? {};
  const {permanentAddress: requesterAddress} = agentInfo ?? {};
  const requesterGender = getGenderEnum(userGender ?? '');
  const createContactTradingInput: ContactTradingInfoInput = {
    customerEmail,
    customerFullName,
    customerPhoneNumber: `["${customerPhoneNumber}"]`,
    propertyPostId: propertyPost?.propertyPostId,
    propertyPostUrl: '',
    requesterAddress: requesterAddress ?? '{}',
    requesterEmail,
    requesterFullName: getUserFullName(user),
    requesterGender,
    requesterId,
    requesterIsAgency: isAgentUser,
    requesterPhoneNumber: `["${requesterPhoneNumber}"]`,
    requesterIsBuyer,
  };
  const input: CreateContactTradingInput = {
    tokenCaptcha,
    contactTradingInfo: createContactTradingInput,
    contactType,
  };
  if (serviceIds) {
    input.contactTradingServiceBonusIds = JSON.stringify(serviceIds);
  }
  for (const [key, value] of Object.entries(input.contactTradingInfo)) {
    if (value === null || value?.length === 0) {
      delete input.contactTradingInfo[key];
    }
  }
  return input;
};

export const useContactToBuy = ({onSubmitSuccess, onError, additionalData}) => {
  const isAgentUser = useSelector(isAgent);
  const {showMessageAlert} = useContext(AppContext);

  const {startApi: createContactTrading} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateC2CContactTradingFoMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'createC2CContactTradingFO',
    onSuccess: response => {
      if (typeof onSubmitSuccess === 'function') {
        callAfterInteraction(() => onSubmitSuccess(response));
      }
    },
    showSpinner: true,
    onError: error => {
      if (error?.errorMessageCode === 'CTD_ERR_001') {
        const message = translate(Message.CCT_MSG_007);
        const data = error?.errorResponse;
        onError && onError({...data, errorMessage: message});
      } else {
        const message = error.errorMessage;
        showMessageAlert(translate(STRINGS.DEFAULT_MODAL_TITLE), message);
      }
    },
  });

  const createContactTradingRequest = ({
    serviceIds,
    propertyPost,
    user,
    customerEmail,
    customerFullName,
    customerPhoneNumber,
    agentInfo,
    tokenCaptcha,
    requesterIsBuyer,
  }) => {
    const input = mapCreateContactTradingInput({
      isAgentUser,
      serviceIds,
      propertyPost,
      user,
      customerEmail,
      customerFullName,
      customerPhoneNumber,
      agentInfo,
      tokenCaptcha,
      contactType: additionalData?.contactType,
      requesterIsBuyer,
    });
    createContactTrading({variables: {input}});
  };

  return {
    createContactTradingRequest,
  };
};
