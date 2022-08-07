import {useNavigation} from '@react-navigation/native';
import {useContext, useRef, useState} from 'react';

import {
  B2C2CProjectDto,
  C2CPropertyPostCommissionTplConfigByDateResponse,
  CheckPropertyPostHasContactTradingDepositedResponse,
  GetB2C2CProjectDetailByIdFoResponse,
  GetFoC2CPropertyPostRequestUpdateReasonResponse,
  useCheckContactTradingByIdLazyQuery,
  useCheckExistingReportByPostIdLazyQuery,
  useCheckPropertyPostHasC2CContactTradingDepositedLazyQuery,
  useClosePropertyPostMutation,
  useCreateC2CPropertyPostMutation,
  useFollowPropertyPostMutation,
  useGetB2C2CProjectDetailByIdFoLazyQuery,
  useGetB2C2CProjectsFoLazyQuery,
  useGetC2CPropertyPostCommissionTplConfigByDateLazyQuery,
  useGetFoC2CPropertyPostRequestUpdateReasonLazyQuery,
  useGetPropertyPostByIdLazyQuery,
  useGetPropertyPostByIdPublicLazyQuery,
  useUnfollowPropertyPostMutation,
  useUpdateC2CPropertyPostMutation,
  useValidateNumberOfPostByUserIdLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {APPROVAL_STATUS, FETCH_POLICY, MAX_PAGE_SIZE, SORT_ORDER} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import logService from '../../service/logService';
import {getPropertyPostApprovalStatusById} from '../../utils/GetMasterData';
import {useLogin, useNotLoggedIn} from '../Auth/useLogin';
import ScreenIds from '../ScreenIds';
import PropertyPostUtils from './PropertyPostUtils';
import {NewPostContext} from './useNewPost';

const useUpdateC2CPropertyPost = ({state, onSuccess, onError}) => {
  const {startApi: updateC2CPropertyPostMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CPropertyPostMutation,
    queryOptions: {},
    dataField: 'updateC2CPropertyPost',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const updateC2CPropertyPost = curState => {
    const updateState = curState ?? state;
    updateC2CPropertyPostMutation({variables: PropertyPostUtils.mapping(updateState, true, false)});
  };

  return {updateC2CPropertyPost};
};

const useUpdateSavedDraftC2CPropertyPost = ({state, onSuccess, onError}) => {
  const {startApi: updateC2CPropertyPostMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateC2CPropertyPostMutation,
    queryOptions: {},
    dataField: 'updateC2CPropertyPost',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const updateSavedDraftC2CPropertyPost = curState => {
    const updateState = curState ?? state;
    updateC2CPropertyPostMutation({
      variables: PropertyPostUtils.mapping(updateState, true, true),
    });
  };

  return {updateSavedDraftC2CPropertyPost};
};

const useHandleErrorPropertyPost = ({navigation}) => {
  const {showErrorAlert, showAppModal} = useContext(AppContext);
  const [errorData, setErrorData] = useState([]);
  const onSetError = error => {
    if (error.errorMessageCode === Message.PO_ERR_027) {
      setErrorData(error?.errorResponse?.badWordListDto);
    } else if (error.errorMessageCode === Message.PO_ERR_048) {
      showAppModal({
        isVisible: true,
        message: error?.errorMessage,
        onOkHandler: () => {
          navigation?.navigate(ScreenIds.GeneralDescription, {reload: true});
        },
      });
    } else {
      showErrorAlert(error?.errorMessage);
    }
  };
  return {errorData, onSetError};
};

const useCreateC2CPropertyPost = ({state, onSuccess, onError}) => {
  const {startApi: createC2CPropertyPostMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateC2CPropertyPostMutation,
    queryOptions: {},
    dataField: 'createC2CPropertyPost',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const createC2CPropertyPost = curState => {
    const updateState = curState ?? state;
    createC2CPropertyPostMutation({
      variables: PropertyPostUtils.mapping(updateState, false, false),
    });
  };

  return {createC2CPropertyPost};
};

const useSaveDraftPropertyPost = ({state, onSuccess, onError}) => {
  const {startApi: createC2CPropertyPostMutation} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateC2CPropertyPostMutation,
    queryOptions: {},
    dataField: 'createC2CPropertyPost',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const saveDraftPropertyPost = curState => {
    const updateState = curState ?? state;
    createC2CPropertyPostMutation({variables: PropertyPostUtils.mapping(updateState, false, true)});
  };

  return {saveDraftPropertyPost};
};

const useFollowPropertyPost = ({propertyPostId, onSuccess, onError}) => {
  const {startApi: followPropertyPost} = useGraphqlApiLazy({
    graphqlApiLazy: useFollowPropertyPostMutation,
    queryOptions: {},
    dataField: 'followPropertyPost',
    onSuccess,
    showSpinner: true,
    onError,
  });

  const followPropertyPostAction = () => {
    followPropertyPost({variables: {followPropertyPostInput: {propertyPostId}}});
  };

  return {followPropertyPostAction};
};

const useUnfollowPropertyPost = ({propertyPostId, onSuccess, onError}) => {
  const {startApi: unfollowPropertyPost} = useGraphqlApiLazy({
    graphqlApiLazy: useUnfollowPropertyPostMutation,
    queryOptions: {},
    dataField: 'unfollowPropertyPost',
    onSuccess,
    showSpinner: true,
    onError,
  });

  const unfollowPropertyPostAction = () => {
    unfollowPropertyPost({variables: {unfollowPropertyPostInput: {propertyPostId}}});
  };

  return {unfollowPropertyPostAction};
};

const useClosePropertyPost = ({closePropertyPostInput, onSuccess, onError}) => {
  const {startApi: closePost} = useGraphqlApiLazy({
    graphqlApiLazy: useClosePropertyPostMutation,
    queryOptions: {},
    dataField: 'closePropertyPost',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const closePropertyPost = newInput => {
    const input = newInput ?? closePropertyPostInput;
    closePost({variables: {closePropertyPostInput: input}});
  };

  return {closePropertyPost};
};

const useValidateNumberOfPostByUserId = ({userId, onSuccess, onError}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useValidateNumberOfPostByUserIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'validateNumberPostByUserId',
    onSuccess,
    onError,
    showSpinner: true,
  });

  const validateNumberOfPost = newUserId => {
    const input = newUserId ?? userId;
    startApi({variables: {validateNumberOfPostByUserIdInput: {userId: input}}});
  };

  return {validateNumberOfPost};
};

const useGetProjects = ({onSuccess}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetB2C2CProjectsFoLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getB2C2CProjectsFo',
    onSuccess,
  });

  const getAllProjects = (keyword, propertyTypeId) => {
    if (propertyTypeId) {
      startApi({
        variables: {
          pageSize: MAX_PAGE_SIZE,
          page: 0,
          projectName: keyword,
          propertyTypeId,
        },
      });
    }
  };

  return {getAllProjects};
};

const useCheckAlreadyContactToBuy = ({propertyPostId, onSuccess, onError}) => {
  const {notLoggedIn} = useLogin();
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckContactTradingByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'checkContactTradingById',
    onSuccess,
    onError,
    showSpinner: false,
  });

  const getContactToBuyStatus = newPostId => {
    if (notLoggedIn) {
      onSuccess({data: {checkContactTradingById: false}});
      return;
    }
    const inputPostId = newPostId ?? propertyPostId;
    if (inputPostId) {
      startApi({variables: {input: {propertyPostId: inputPostId}}});
    }
  };

  return {getContactToBuyStatus};
};

const useCheckReportedPropertyPost = ({propertyPostId, onSuccess, onError}) => {
  const {notLoggedIn} = useLogin();
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckExistingReportByPostIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: '',
    onSuccess,
    onError,
    showSpinner: false,
  });

  const getReportedStatus = newPostId => {
    if (notLoggedIn) {
      onSuccess({data: {checkExistingReportByPostId: false}});
      return;
    }
    const inputPostId = newPostId ?? propertyPostId;
    if (inputPostId) {
      startApi({variables: {input: inputPostId}});
    }
  };

  return {getReportedStatus};
};

const useGetB2C2CProjectDetailByIdFo = () => {
  const onSuccessHandler = useRef();

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetB2C2CProjectDetailByIdFoLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getB2C2CProjectDetailByIdFo',
    onSuccess: (data: GetB2C2CProjectDetailByIdFoResponse) => {
      if (data.errorCode === 0 && data.b2C2CProject) {
        onSuccessHandler.current && onSuccessHandler.current(data.b2C2CProject);
      } else {
        logService.log(
          'getB2C2CProjectDetailByIdFo',
          `Error ${data?.errorCode}: ${data?.errorMessage}`,
        );
      }
    },
    showSpinner: false,
  });

  const getB2C2CProjectDetailById = (b2C2CProjectId, onSuccess) => {
    if (onSuccess) {
      onSuccessHandler.current = onSuccess;
    }

    if (b2C2CProjectId) {
      startApi({variables: {b2C2CProjectId}});
    }
  };

  return {getB2C2CProjectDetailById};
};

const useGetPropertyPostDetail = ({propertyPostId, onSuccess}) => {
  const {resetState, parseToGetEditData, updateEditData} = useContext(NewPostContext);
  const [loading, setLoading] = useState(false);
  const {showErrorAlert, getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const notLoggedIn = useNotLoggedIn();
  const navigation = useNavigation();

  const postDetailRef = useRef({});
  const setPostDetail = data => {
    postDetailRef.current = data ?? {};
  };
  const getPostDetail = () => {
    return postDetailRef.current;
  };

  const updatePostDetail = data => {
    if (!data) {
      return;
    }
    const oldDetail = postDetailRef.current;
    postDetailRef.current = {...oldDetail, ...data};
  };

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: notLoggedIn
      ? useGetPropertyPostByIdPublicLazyQuery
      : useGetPropertyPostByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: notLoggedIn ? 'propertyPostDetail' : 'propertyPostById',
    onSuccess: onSuccessGetPostDetail,
    onError: error => {
      const responseStatus = error?.graphqlError?.networkError?.statusCode;
      if (responseStatus !== 401) {
        let message = translate('propertyPost.error.cannotFindPost');
        if (
          [translate(Message.NTW_SERVER_ERROR), translate(Message.NTW_NETWORK_ERROR)].includes(
            error?.errorMessage,
          )
        ) {
          message = error?.errorMessage;
        }
        showErrorAlert(message, () => {
          navigation?.canGoBack() && navigation.goBack();
        });
      }
    },
  });

  const {getContactToBuyStatus} = useCheckAlreadyContactToBuy({
    propertyPostId,
    onSuccess: onSuccessGetContactStatus,
    onError: onErrorGetContactStatus,
  });

  const {getReportedStatus} = useCheckReportedPropertyPost({
    propertyPostId,
    onSuccess: onSuccessGetReportStatus,
    onError: onErrorGetReportStatus,
  });

  const {getB2C2CProjectDetailById} = useGetB2C2CProjectDetailByIdFo();

  const {getCommissionForTpl} = useGetCommissionForTpl({
    onSuccess: percentage => {
      if (percentage) {
        const defaultCommission = {
          commissionTpl: percentage,
          commissionBuyer: 100 - percentage,
          commissionSeller: 0,
        };

        updatePostDetail({
          originState: {
            ...getPostDetail()?.originState,
            ...defaultCommission,
          },
        });

        updateEditData && updateEditData(getPostDetail());
      }
    },
  });

  const {getUpdateReason} = useGetUpdateReasonByPostId();

  function onSuccessGetReportStatus(data) {
    const reported = !!data.checkExistingReportByPostId;
    updatePostDetail({reported});
    getContactToBuyStatus();
  }

  function onErrorGetReportStatus() {
    getContactToBuyStatus();
  }

  function onSuccessGetContactStatus(data) {
    const alreadyContactedToBuy = data?.buy;
    const alreadyContactedToRent = data?.rent;
    updatePostDetail({alreadyContactedToBuy, alreadyContactedToRent});

    updateEditData && updateEditData(getPostDetail());
    onSuccess(getPostDetail());
    setLoading(false);
  }

  function onErrorGetContactStatus() {
    onSuccess(getPostDetail());
    setLoading(false);
  }

  const onSuccessGetB2C2CProjectDetail = (data: B2C2CProjectDto) => {
    updatePostDetail({
      originState: {
        ...getPostDetail()?.originState,
        b2C2CProjectInfo: data,
      },
    });
    updateEditData(getPostDetail());
  };

  function onSuccessGetPostDetail(data) {
    const parsedData = parseToGetEditData(data);
    setPostDetail(parsedData);

    if (!data) {
      onSuccess(parsedData);
      setLoading(false);
      return;
    }

    const postId = parsedData.originState?.propertyPostId;
    const b2C2CProjectId = parsedData.originState?.b2C2CProjectId;
    const approvalStatus = getPropertyPostApprovalStatusById(
      masterData,
      parsedData.originState?.propertyPostApprovalStatusId,
    )?.propertyPostApprovalStatusName;

    if (approvalStatus === APPROVAL_STATUS.REQUEST) {
      getUpdateReason(postId);
    }

    if (b2C2CProjectId) {
      getB2C2CProjectDetailById(b2C2CProjectId, onSuccessGetB2C2CProjectDetail);
    }

    if (!parsedData.originState?.commissionTpl) {
      getCommissionForTpl();
    }

    getReportedStatus();
  }

  const getPropertyPostDetail = newPostId => {
    resetState && resetState();
    setLoading(true);
    const inputPostId = newPostId ?? propertyPostId;
    if (inputPostId) {
      startApi({variables: {propertyPostId: inputPostId}});
    }
  };

  return {getPropertyPostDetail, loading};
};

const useGetCommissionForTpl = ({onSuccess}) => {
  const [commissionTpl, setCommissionTpl] = useState(0);

  const {startApi: getCommissionConfigs} = useGraphqlApiLazy({
    graphqlApiLazy: useGetC2CPropertyPostCommissionTplConfigByDateLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'c2CPropertyPostCommissionTPLConfigByDate',
    onSuccess: (data: C2CPropertyPostCommissionTplConfigByDateResponse) => {
      if (data.errorCode === 0) {
        setCommissionTpl(data.transactionCommissionTpl ?? 0);
        onSuccess && onSuccess(data.transactionCommissionTpl);
      }
    },
    showSpinner: false,
  });

  const getCommissionForTpl = time => {
    getCommissionConfigs({
      variables: {
        date: time ?? new Date().getTime(),
      },
    });
  };

  return {
    getCommissionForTpl,
    commissionTpl,
  };
};

const useCheckPostCanBeEdited = () => {
  const onSuccessHandler = useRef();
  const onErrorHandler = useRef();

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckPropertyPostHasC2CContactTradingDepositedLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'checkPropertyPostHasC2CContactTradingDeposited',
    onSuccess: (data: CheckPropertyPostHasContactTradingDepositedResponse) => {
      if (data.errorCode === 0) {
        onSuccessHandler.current && onSuccessHandler.current(true, data);
      } else {
        onSuccessHandler.current && onSuccessHandler.current(false, data);
      }
    },
    onError: error => {
      onErrorHandler.current && onErrorHandler.current(error);
    },
    showSpinner: true,
  });

  const checkProperty = ({onSuccess, onError, propertyPostId}) => {
    onSuccessHandler.current = onSuccess;
    onErrorHandler.current = onError;
    startApi({
      variables: {
        propertyPostId,
      },
    });
  };

  return {
    checkProperty,
  };
};

const useGetUpdateReasonByPostId = () => {
  const {setInputFieldState} = useContext(NewPostContext);
  const onSuccess = useRef();
  const onSuccessRes = (res: GetFoC2CPropertyPostRequestUpdateReasonResponse) => {
    if (res.requestedUpdatingReason) {
      const arrayReasons = JSON.parse(res.requestedUpdatingReason);
      const arrayReasonsToText = arrayReasons?.length > 0 ? arrayReasons.join('\n') : arrayReasons;

      setInputFieldState({requestedUpdatingReason: arrayReasonsToText});

      if (onSuccess.current) {
        onSuccess.current(res.requestedUpdatingReason);
        onSuccess.current = null;
      }
    }
  };

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetFoC2CPropertyPostRequestUpdateReasonLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getFoC2CPropertyPostRequestUpdateReason',
    onSuccess: onSuccessRes,
    showSpinner: false,
  });

  const getUpdateReason = (propertyPostId, onSuccessCb) => {
    if (onSuccessCb) {
      onSuccess.current = onSuccessCb;
    }

    if (propertyPostId) {
      startApi({variables: {propertyPostId}});
    }
  };

  return {getUpdateReason};
};

export {
  useCheckAlreadyContactToBuy,
  useCheckPostCanBeEdited,
  useCheckReportedPropertyPost,
  useClosePropertyPost,
  useCreateC2CPropertyPost,
  useFollowPropertyPost,
  useGetCommissionForTpl,
  useGetProjects,
  useGetPropertyPostDetail,
  useGetUpdateReasonByPostId,
  useHandleErrorPropertyPost,
  useSaveDraftPropertyPost,
  useUnfollowPropertyPost,
  useUpdateC2CPropertyPost,
  useUpdateSavedDraftC2CPropertyPost,
  useValidateNumberOfPostByUserId,
};
