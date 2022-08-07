import { MEMBER } from '../actionsType';

const initialState = {
  profile: {},
  hideBalance: false,
  topenIdProfile: {},
  availableBalance: 0,
  creditBalance: 0,
  hasWithdrawalRequest: false,
  hasAdvanceRequest: false,
  advanceInfo: {},
  legals: {},
  terms: {},
  privacy: {}
};

const member = (state = initialState, action) => {
  switch (action.type) {
    case MEMBER.GET_TOPENID_PROFILE.SUCCESS: {
      return {
        ...state,
        topenIdProfile: action.payload
      };
    }
    case MEMBER.GET_TOPENID_PROFILE.CLEAR: {
      return {
        ...state,
        topenIdProfile: {}
      };
    }
    case MEMBER.GET_PROFILE.SUCCESS: {
      return {
        ...state,
        profile: action.payload.profile
      };
    }
    case MEMBER.UPDATE_PROFILE.SUCCESS: {
      return {
        ...state,
        profile: action.payload.profile
      };
    }

    case MEMBER.HIDE_BALANCE.HANDLER: {
      return {
        ...state,
        hideBalance: action.payload.hideBalance
      };
    }

    case MEMBER.UPLOAD_AVATAR.SUCCESS: {
      return {
        ...state,
        profile: {
          ...state.profile,
          imageLink: action.payload.fileStream
        }
      };
    }

    case MEMBER.GET_AGENCY_INFORMATION.HANDLER: {
      return {
        ...state,
        Id: action.payload.Id
      };
    }

    case MEMBER.GET_AGENCY_INFORMATION.SUCCESS: {
      return {
        ...state,
        agencyInformation: action.payload.agencyInformation
      };
    }

    case MEMBER.GET_SUBCRIPTION_TOPENERS.HANDLER: {
      return {
        ...state
      };
    }

    case MEMBER.GET_SUBCRIPTION_TOPENERS.SUCCESS: {
      return {
        ...state,
        subscriptionTopeners: action.payload.subscriptionTopeners
      };
    }

    case MEMBER.GET_POLICY_SUBSCRIPTION.HANDLER: {
      return {
        ...state
      };
    }

    case MEMBER.GET_POLICY_SUBSCRIPTION.SUCCESS: {
      return {
        ...state,
        policySubscription: action.payload.policySubscription
      };
    }

    case MEMBER.GET_MEMBER_PROFILE.HANDLER: {
      return {
        ...state
      };
    }

    case MEMBER.GET_MEMBER_PROFILE.SUCCESS: {
      return {
        ...state,
        memberProfile: action.payload.memberProfile
      };
    }

    case MEMBER.POST_RENEWAL_TOPENER.HANDLER: {
      return {
        ...state,
        ...action.payload
      };
    }

    case MEMBER.POST_RENEWAL_TOPENER.SUCCESS: {
      return {
        ...state,
        renewalTopenerResult: action.payload.renewalTopenerResult
      };
    }

    case MEMBER.GET_COMMISSION_INFORMATION.SUCCESS: {
      return {
        ...state,
        availableBalance: action.payload.availableBalance,
        creditBalance: action.payload.creditBalance,
        hasWithdrawalRequest: action.payload.hasWithdrawalRequest,
        withdrawalTransactionId: action.payload.withdrawalTransactionId,
        hasAdvanceRequest: action.payload.hasAdvanceRequest,
        hasRequestRemaining: action.payload.hasRequestRemaining
      };
    }

    case MEMBER.GET_ADVANCE_INFO_BY_ID.SUCCESS: {
      return {
        ...state,
        advanceInfo: action.payload
      };
    }

    case MEMBER.GET_LEGAL_IMAGE.SUCCESS: {
      return {
        ...state,
        legals: action.payload
      };
    }

    case MEMBER.CREATE_MEMBER_FROM_SDK.HANDLER: {
      return {
        ...state
      };
    }
    case MEMBER.CREATE_MEMBER_FROM_SDK.FAILURE: {
      return {
        ...state
      };
    }

    case MEMBER.CREATE_TPF_MEMBER_FROM_SDK.HANDLER: {
      return {
        ...state
      };
    }
    case MEMBER.CREATE_TPF_MEMBER_FROM_SDK.FAILURE: {
      return {
        ...state
      };
    }

    case MEMBER.GET_POLICY_TOPENID.HANDLER: {
      return {
        ...state
      };
    }
    case MEMBER.GET_POLICY_TOPENID.SUCCESS: {
      const [terms, privacy] = action.payload?.data;
      return {
        ...state,
        terms: terms,
        privacy: privacy
      };
    }

    case MEMBER.GET_POLICY_TOPENID.FAILURE: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
};

export default member;
