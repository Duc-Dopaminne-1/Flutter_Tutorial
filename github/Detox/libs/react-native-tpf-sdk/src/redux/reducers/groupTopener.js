import { GROUP_TOPENER } from '../actionsType';

const initialState = {
  listLoading: null,
  findGroupLoading: null,
  listGroup: [],
  code: null,
  groupDetail: {},
  isAddress: null,
  success: '',
  listMember: [],
  message: '',
  joinRequestMember: [],
  leaveRequestMember: [],
  topenerDetail: [],
  totalCount: 0,
  totalCountRequestJoin: 0,
  totalCountRequestLeave: 0,
  loading: null
};

const groupTopener = (state = initialState, action) => {
  switch (action.type) {
    case GROUP_TOPENER.GET_GROUP_BY_TOPENER.HANDLER: {
      return {
        ...state,
        listLoading: true
      };
    }
    case GROUP_TOPENER.GET_GROUP_BY_TOPENER.SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        listLoading: false,
        code: null,
        groupDetail: data
      };
    }
    case GROUP_TOPENER.GET_GROUP_BY_TOPENER.FAILURE: {
      const { code } = action.payload;
      return {
        ...state,
        code: code,
        listLoading: false
      };
    }
    case GROUP_TOPENER.GET_GROUP_BY_TOPENER.CLEAR: {
      return {
        ...state,
        groupDetail: {}
      };
    }

    case GROUP_TOPENER.GET_GROUP_FOR_MEMBER.HANDLER: {
      return {
        ...state,
        findGroupLoading: true
      };
    }
    case GROUP_TOPENER.GET_GROUP_FOR_MEMBER.SUCCESS: {
      const { data, fromRoute } = action.payload;
      return {
        ...state,
        findGroupLoading: false,
        listGroup: data,
        isAddress: fromRoute === 'referralCode' ? state.isAddress : null
      };
    }
    case GROUP_TOPENER.GET_GROUP_FOR_MEMBER.FAILURE: {
      const { code } = action.payload;
      return {
        ...state,
        findGroupLoading: false,
        isAddress: code,
        listGroup: []
      };
    }
    case GROUP_TOPENER.GET_GROUP_FOR_MEMBER.CLEAR: {
      return {
        ...state,
        success: '',
        listGroup: []
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER.HANDLER: {
      return {
        ...state,
        loading: true
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER.SUCCESS: {
      const { data, loadMore, totalCount } = action.payload;
      const newData = loadMore ? [...state.listMember, ...data] : data;
      return {
        ...state,
        loading: false,
        listMember: newData,
        totalCount
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER.FAILURE: {
      const { code, message } = action.payload;
      return {
        ...state,
        loading: false,
        isAddress: code,
        message: message
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER.CLEAR: {
      return {
        ...state,
        listMember: []
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_JOIN.HANDLER: {
      return {
        ...state,
        listLoading: true
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_JOIN.SUCCESS: {
      const { data, totalCount } = action.payload;
      return {
        ...state,
        listLoading: false,
        joinRequestMember: data,
        totalCountRequestJoin: totalCount
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_JOIN.FAILURE: {
      const { code, message } = action.payload;
      return {
        ...state,
        listLoading: false,
        isAddress: code,
        message: message
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_LEAVE.HANDLER: {
      return {
        ...state,
        listLoading: true
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_LEAVE.SUCCESS: {
      const { data, totalCount } = action.payload;
      return {
        ...state,
        listLoading: false,
        leaveRequestMember: data,
        totalCountRequestLeave: totalCount
      };
    }
    case GROUP_TOPENER.GET_LIST_REQUEST_OR_MEMBER_LEAVE.FAILURE: {
      const { code, message } = action.payload;
      return {
        ...state,
        listLoading: false,
        isAddress: code,
        message: message
      };
    }
    case GROUP_TOPENER.GET_MEMBER_INFO_DETAIL.HANDLER: {
      return {
        ...state,
        listLoading: true
      };
    }
    case GROUP_TOPENER.GET_MEMBER_INFO_DETAIL.SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        listLoading: false,
        topenerDetail: data
      };
    }
    case GROUP_TOPENER.GET_MEMBER_INFO_DETAIL.FAILURE: {
      const { code, message } = action.payload;
      return {
        ...state,
        listLoading: false,
        isAddress: code,
        message: message
      };
    }

    default:
      return state;
  }
};

export default groupTopener;
