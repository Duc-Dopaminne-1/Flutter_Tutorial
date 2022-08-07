import { AUTH } from '../actionsType';
import { MEMBER_TYPE } from '../../global/member_type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  accessToken: '',
  memberId: null,
  topenId: '',
  role: '',
  isLogin: false,
  isExist: null,
  noReferralCode: null,
  isActive: false,
  isNewMember: false,
  hasLocalPIN: false,
  localPIN: {},
  faceIDs: {},
  touchIDs: {},
  bypassPinCode: true,
  listReferral: [],
  loading: null,
  totalCount: 0,
  topenIdConfigs: {},
  passwordPattern: null,
  passwordPatternDescription: null,
  loginByToken: false
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH.REMOVE_LOCAL_PIN: {
      const memberId = action.payload;
      const newLocalPIN = {
        ...state.localPIN
      };

      delete newLocalPIN[memberId];
      return {
        ...state,
        hasLocalPIN: false,
        localPIN: newLocalPIN
      };
    }

    case AUTH.SET_FACE_ID: {
      const faceID = action.payload;

      return {
        ...state,
        faceIDs: {
          ...state.faceIDs,
          [faceID.memberId]: faceID.value
        }
      };
    }

    case AUTH.SET_TOUCH_ID: {
      const touchID = action.payload;

      return {
        ...state,
        touchIDs: {
          ...state.touchIDs,
          [touchID.memberId]: touchID.value
        }
      };
    }

    case AUTH.SET_LOCAL_PIN: {
      const pinCode = action.payload;
      return {
        ...state,
        hasLocalPIN: true,
        localPIN: {
          ...state.localPIN,
          [pinCode.memberId]: pinCode.pin
        }
      };
    }
    case AUTH.GET_ACCESS_TOKEN.SUCCESS: {
      return { ...state };
    }

    case AUTH.SET_LOGIN.SUCCESS: {
      const { memberId, role } = action.payload || {};

      return {
        ...state,
        isExist: null,
        isLogin: true,
        memberId: memberId || state.memberId,
        role: role || state.role
      };
    }

    case AUTH.SET_BY_PASS_PIN_CODE: {
      const value = action?.payload || false;

      return { ...state, bypassPinCode: value };
    }

    case AUTH.LOG_OUT.SUCCESS: {
      return {
        accessToken: '',
        memberId: null,
        topenId: '',
        role: '',
        isLogin: false,
        isExist: null,
        noReferralCode: null,
        isActive: false,
        isNewMember: false,
        hasLocalPIN: false,
        localPIN: {},
        faceIDs: {},
        touchIDs: {},
        bypassPinCode: true,
        listReferral: [],
        loading: null,
        totalCount: 0,
        topenIdConfigs: {},
        passwordPattern: null,
        passwordPatternDescription: null,
        loginByToken: false
      };
    }

    case AUTH.SET_READ_ONBOARDING.HANDLER: {
      return { ...state, isRead: true };
    }
    case AUTH.CHECK_MEMBER_IS_EXIST.HANDLER: {
      const payload = action.payload || {};
      return {
        ...state,
        ...payload
      };
    }

    case AUTH.CHECK_MEMBER_IS_EXIST.SUCCESS: {
      const { isExist, isActive, memberId, topenId, memberTopenerType, acceptSDK, acceptPolicy } =
        action.payload || {};
      return {
        ...state,
        acceptPolicy,
        acceptSDK,
        isExist,
        memberId,
        topenId,
        isActive,
        role: memberTopenerType || MEMBER_TYPE.Member
      };
    }
    case AUTH.CHECK_MEMBER_IS_EXIST.FAILURE: {
      return {
        ...state,
        isExist: 'failure'
      };
    }

    case AUTH.UPDATE_REFERAL_CODE.SUCCESS: {
      return {
        ...state,
        noReferralCode: true
      };
    }

    case AUTH.UPDATE_REFERAL_CODE.FAILURE: {
      return {
        ...state,
        noReferralCode: false
      };
    }

    case AUTH.UPDATE_REFERAL_CODE.CLEAR: {
      return {
        ...state,
        noReferralCode: null
      };
    }

    case AUTH.SET_ACCESS_TOKEN.STORE: {
      AsyncStorage.setItem('ACCESS_TOKEN', action.payload.accessToken);
      return {
        ...state,
        accessToken: action.payload.accessToken
      };
    }
    case AUTH.GET_LIST_REFERRAL_BY_MEMBER.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case AUTH.GET_LIST_REFERRAL_BY_MEMBER.SUCCESS: {
      const { items, totalCount, loadMore } = action.payload;
      const newData = loadMore ? [...state.listReferral, ...items] : items;
      return {
        ...state,
        loading: false,
        listReferral: newData,
        totalCount
      };
    }
    case AUTH.GET_LIST_REFERRAL_BY_MEMBER.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    case AUTH.GET_AUTH_TOPENID_INFO.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }

    case AUTH.GET_AUTH_TOPENID_INFO.SUCCESS: {
      return {
        ...state,
        loading: false,
        topenIdConfigs: action.payload
      };
    }
    case AUTH.GET_AUTH_TOPENID_INFO.FAILURE: {
      return {
        ...state,
        loading: false
      };
    }

    case AUTH.GET_PASSWORD_PATTERN.HANDLER: {
      return {
        ...state
      };
    }

    case AUTH.GET_PASSWORD_PATTERN.SUCCESS: {
      return {
        ...state,
        passwordPattern: action.payload?.pattern,
        passwordPatternDescription: action.payload?.message
      };
    }
    case AUTH.GET_PASSWORD_PATTERN.FAILURE: {
      return {
        ...state
      };
    }

    case AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.HANDLER: {
      const payload = action.payload || {};
      return {
        ...state,
        ...payload
      };
    }

    case AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.SUCCESS: {
      const {
        isExist,
        isVAS,
        acceptSDK,
        hasPassword,
        acceptPolicy,
        memberId,
        memberTopenerType,
        topenId,
        isActive
      } = action.payload || {};
      return {
        ...state,
        acceptPolicy,
        acceptSDK,
        isExist,
        hasPassword,
        memberId,
        isActive,
        isVAS,
        topenId,
        role: memberTopenerType || MEMBER_TYPE.Member
      };
    }
    case AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.FAILURE: {
      return {
        ...state,
        isExist: 'failure'
      };
    }

    case AUTH.CHANGE_PASSWORD.HANDLER: {
      return {
        ...state
      };
    }

    case AUTH.CHANGE_PASSWORD.SUCCESS: {
      return {
        ...state
      };
    }
    case AUTH.CHANGE_PASSWORD.FAILURE: {
      return {
        ...state
      };
    }

    case AUTH.SET_LOGIN_BY_TOKEN: {
      return {
        ...state,
        loginByToken: action.payload
      };
    }

    case AUTH.GET_TOPEN_ID.HANDLER: {
      return {
        ...state
      };
    }

    case AUTH.GET_TOPEN_ID.SUCCESS: {
      const payload = action.payload || {};
      return {
        ...state,
        ...payload
      };
    }
    case AUTH.GET_TOPEN_ID.FAILURE: {
      return {
        ...state
      };
    }

    default:
      return state;
  }
};

export default auth;
