import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {
  useCheckCurrentUserInAgentAssignedBySaleSeasonIdLazyQuery,
  useCheckPropertyPostLockedForBookingBySeasonIdLazyQuery,
  useFollowProjectMutation,
  useGetProjectDetailLazyQuery,
  useGetSimilarProjectsForFoLazyQuery,
  useUnfollowProjectMutation,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {isAgent} from '../../appData/user/selectors';
import {FETCH_POLICY, SESSION_STATUS, TRANSACTION_MODE} from '../../assets/constants';
import {updateSingleItem} from '../../components/LazyList';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {mapIsFollowedIntoItem} from '../../utils/MapDataUtils';
import {getNowTimeStamp, getTransactionDateTimeString} from '../../utils/TimerCommon';
import {useLogin} from '../Auth/useLogin';
import {useGetFollowProjectIds} from '../ManagePost/hooks/useGetFollowProjectIds';

const useGetProjectDetail = ({projectId, onSuccess, onError}) => {
  const [projectDetail, setProjectDetail] = useState({});
  const [projectSimilar, setProjectSimilar] = useState([]);
  const [address, setAddress] = useState('');
  const {notLoggedIn} = useLogin();
  const {fetchFollowProjectIds} = useGetFollowProjectIds({
    fetchFollowIdsSuccess: followIds => fetchFollowIdsSuccess(followIds),
  });

  const fetchFollowIdsSuccess = followIds => {
    const data = mapIsFollowedIntoItem({
      listFollowIds: followIds,
      listItems: projectSimilar,
      keyId: 'projectId',
    });
    setProjectSimilar(data);
  };

  const {getProjectSimilar} = useGetProjectSimilar({
    onSuccess: items => {
      setProjectSimilar(items);
      if (!notLoggedIn) {
        fetchFollowProjectIds(items.map(item => item.projectId));
      }
    },
  });

  const {startApi: fetchProjectDetail, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetProjectDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE, onError},
    dataField: 'foProjectById',
    onSuccess: onSuccessFetchProjectDetail,
    onError,
  });

  function onSuccessFetchProjectDetail(foProjectById) {
    setProjectDetail(foProjectById);

    getProjectSimilar({
      investorId: foProjectById?.investorId || null,
      projectId: foProjectById?.projectId,
      propertyTypeId: foProjectById?.propertyTypeId,
      placeJson: {
        CityId: foProjectById?.projectAddress?.cityId,
        DistrictIds: foProjectById?.projectAddress?.districtId,
      },
    });

    setAddress(extractAddressData(foProjectById?.projectAddress));
    onSuccess && onSuccess(foProjectById);
  }

  const getProjectDetail = newProjectId => {
    const input = newProjectId ?? projectId;
    fetchProjectDetail({variables: {projectId: input}});
  };

  const updateProjectSimilar = item => {
    const temps = updateSingleItem(item, projectSimilar, 'projectId');
    setProjectSimilar(temps);
  };

  return {
    getProjectDetail,
    setProjectDetail,
    updateProjectSimilar,
    projectSimilar,
    projectDetail: projectDetail ?? {},
    address,
    loading,
  };
};

const useGetProjectSimilar = ({onSuccess}) => {
  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSimilarProjectsForFoLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'getSimilarProjectsForFO.edges',
    onSuccess: data => onSuccessGetProjectSimilar(data),
  });

  const onSuccessGetProjectSimilar = data => {
    onSuccess(data);
  };

  const getProjectSimilar = ({
    investorId,
    projectId,
    placeJson = {CityId: '', DistrictIds: ''},
    propertyTypeId,
  }) => {
    startApi({
      variables: {
        getSimilarProjectsForFOInput: {
          investorId: investorId,
          page: 1,
          pageSize: 5,
          projectId: projectId,
          placeJson: `[{"CityId":${placeJson.CityId},"DistrictIds":[${placeJson.DistrictIds}]}]`,
          propertyTypeId: propertyTypeId,
        },
      },
    });
  };

  return {
    getProjectSimilar,
    loading,
  };
};

const useFollowProject = ({projectId, onSuccess, onError}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useFollowProjectMutation,
    queryOptions: {},
    dataField: 'followProject',
    onSuccess,
    showSpinner: true,
    onError,
  });

  const followProject = newProjectId => {
    const newInput = newProjectId ?? projectId;
    startApi({variables: {input: {projectId: newInput}}});
  };

  return {followProject};
};

const useUnfollowProject = ({projectId, onSuccess, onError}) => {
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useUnfollowProjectMutation,
    queryOptions: {},
    dataField: 'unfollowProject',
    onSuccess,
    showSpinner: true,
    onError,
  });

  const unfollowProject = newProjectId => {
    const newInput = newProjectId ?? projectId;
    startApi({variables: {input: {projectId: newInput}}});
  };

  return {unfollowProject};
};

const useCheckUserAssignedByProject = () => {
  const [isCheckAssigned, setCheckAssigned] = useState(false);
  const checkUserSuccess = e => {
    setCheckAssigned(e.isExist);
  };

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckCurrentUserInAgentAssignedBySaleSeasonIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'checkCurrentUserInAgentAssignedBySaleSeasonId',
    onSuccess: checkUserSuccess,
  });

  const checkUseAssignedProject = saleSeasonId => {
    startApi({
      variables: {
        request: {
          saleSeasonId: saleSeasonId,
        },
      },
    });
  };

  return {isCheckAssigned, checkUseAssignedProject};
};

const useSellSessionProject = ({projectDetail, projectStatus}) => {
  const saleSeasonInfo = projectDetail?.saleSeasonInfo;
  const allTopenersCanViewProducts = saleSeasonInfo?.allTopenersCanViewProducts;
  const saleSessionId = saleSeasonInfo?.saleSeasonId;

  const {isCheckAssigned, checkUseAssignedProject} = useCheckUserAssignedByProject();
  const {notLoggedIn} = useLogin();
  const isAgentUser = useSelector(isAgent);

  useEffect(() => {
    if (projectDetail && saleSessionId && !notLoggedIn && isAgentUser) {
      checkUseAssignedProject(saleSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetail]);

  let sessionStatus = '';
  const now = getNowTimeStamp();
  if (now >= saleSeasonInfo?.startBookingDatetime && now <= saleSeasonInfo?.genericBasketDatetime) {
    // Rổ hàng riêng
    sessionStatus = SESSION_STATUS.PRIVATE;
  } else {
    // Rổ hàng chung
    sessionStatus = SESSION_STATUS.GENERIC;
  }

  let isShowButtonBook = false;
  if (projectStatus === TRANSACTION_MODE.NOTHING) {
    isShowButtonBook = false;
  } else if (projectStatus === TRANSACTION_MODE.BOOKING) {
    isShowButtonBook = true;
  } else if (
    allTopenersCanViewProducts ||
    (sessionStatus === SESSION_STATUS.PRIVATE && isCheckAssigned) ||
    sessionStatus === SESSION_STATUS.GENERIC
  ) {
    isShowButtonBook = true;
  }
  return {isShowButtonBook};
};

const useCheckLockSlot = ({onSuccess, onError}) => {
  const {startApi, loading} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useCheckPropertyPostLockedForBookingBySeasonIdLazyQuery,
    dataField: 'checkPropertyPostLockedForBookingBySeasonId',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    onSuccess: response => {
      onSuccess(response);
    },
    onError: error => {
      const openDateTime = error?.errorResponse?.openDatetime;
      let errorMessage = error.errorMessage;
      let isNotification = false;
      if (openDateTime) {
        errorMessage += getTransactionDateTimeString(openDateTime);
        isNotification = true;
      }
      onError({errorMessage, isNotification});
    },
  });

  const checkLockedSlot = ({saleSeasonId}) => {
    startApi({variables: {input: {saleSeasonId}}});
  };

  return {checkLockedSlot, loading};
};

export {
  useCheckLockSlot,
  useFollowProject,
  useGetProjectDetail,
  useSellSessionProject,
  useUnfollowProject,
};
