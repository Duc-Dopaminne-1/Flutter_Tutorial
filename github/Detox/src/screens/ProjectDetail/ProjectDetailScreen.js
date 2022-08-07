/* eslint-disable react-hooks/exhaustive-deps */
import {useIsFocused} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {useValidateReCaptchaForPropertyPostBasketMutation} from '../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/useAppContext';
import {LastModifiedContext} from '../../appData/lastModifiedContext/useLastModifiedContext';
import {isMember} from '../../appData/user/selectors';
import {
  CONSULT_PROPERTY_POST_SUPPORT_TYPE,
  PROJECT_STATUS,
  SEARCH_TYPE_INDEX,
  TRANSACTION_MODE,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {RegisterAgentModal} from '../../components/Modal/RegisterAgentModal';
import {Captcha} from '../../components/RecaptchaV2/Captcha';
import JsonDataUtils from '../../utils/JsonDataUtils';
import useInterval from '../../utils/useInterval';
import {useLogin} from '../Auth/useLogin';
import {BookingContext} from '../BookingDeposit/useBooking';
import {useMountInteraction} from '../commonHooks';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../WithSegment';
import {getTransactionStatusByTime} from './getTransactionStatusByTime';
import ProjectDetailContainer from './ProjectDetailContainer';
import {
  useCheckLockSlot,
  useFollowProject,
  useGetProjectDetail,
  useSellSessionProject,
  useUnfollowProject,
} from './useProjectActions';

const CHECK_STATUS_INTERVAL = 30000;

const shouldStartInterval = ({projectDetail}) => {
  //Start Interval to change status of project
  //If project status is not deposit -> it may change status from nothing -> booking -> deposit
  //If project status is deposit but before close date time -> call API when closeDateTime, projectStatusName may change to SOLD
  const status = getTransactionStatusByTime(projectDetail);
  const closeDatetime = projectDetail?.saleSeasonInfo?.closeDatetime;
  const isStatusOtherThanDepositAndSold =
    status !== TRANSACTION_MODE.DEPOSIT && projectDetail?.projectStatusName !== PROJECT_STATUS.SOLD;
  const isStatusDepositBeforeCloseTime =
    closeDatetime &&
    status === TRANSACTION_MODE.DEPOSIT &&
    moment().isBefore(moment(closeDatetime));
  return isStatusOtherThanDepositAndSold || isStatusDepositBeforeCloseTime;
};

const getParamsNeedAdvice = projectDetail => {
  return {
    postTitle: projectDetail.projectName,
    image: projectDetail.featurePhotos,
    projectId: projectDetail.projectId,
    supportRequestType: CONSULT_PROPERTY_POST_SUPPORT_TYPE,
  };
};

const ProjectDetailScreen = ({navigation, route}) => {
  const {projectId: projectIdParam, shouldRefresh, showBottomView} = route?.params || {};
  const {track} = useAnalytics();
  const {setProject, needUpdateState, state, setUpdateProjectDetail, resetState} =
    useContext(BookingContext);
  const {formatPrice} = useFormatPrice();
  const projectId = projectIdParam ?? state?.project?.projectId;
  const [projectStatus, setProjectStatus] = useState(TRANSACTION_MODE.NOTHING);
  const [streetviews, setStreetviews] = useState([]);
  const [threedviews, setThreedviews] = useState([]);
  const [videoviews, setVideoviews] = useState([]);
  const [showRegisterAgentModal, setShowRegisterAgent] = useState(false);
  const {updateProject} = useContext(LastModifiedContext);
  const {showMessageAlert, showAppModal} = useContext(AppContext);
  const isMemberUser = useSelector(isMember);
  const {showLogin, notLoggedIn} = useLogin();
  const captchaRef = useRef(null);
  const {
    getProjectDetail,
    setProjectDetail,
    updateProjectSimilar,
    projectSimilar,
    projectDetail,
    address,
    loading,
  } = useGetProjectDetail({
    onSuccess: onSuccessGetProjectDetail,
  });
  const {isShowButtonBook} = useSellSessionProject({projectDetail, projectStatus});

  const checkBookingSuccess = ({requestId = ''} = {}) => {
    const status = getTransactionStatusByTime(projectDetail);
    if (status && status !== TRANSACTION_MODE.NOTHING) {
      let transferDetail = {...projectDetail, projectStatus: status};
      if (notLoggedIn) {
        transferDetail = {...transferDetail, requestId: requestId};
      }
      setProject(transferDetail);
      navigation.navigate(ScreenIds.SlotSelection, transferDetail);
    }
  };

  const {checkLockedSlot} = useCheckLockSlot({
    onSuccess: () => {
      checkBookingSuccess();
    },
    onError: ({errorMessage, isNotification}) => {
      showAppModal({
        isVisible: true,
        title: isNotification ? translate('NOTIFICATION') : translate('ERROR'),
        message: errorMessage,
        onOkHandler: () => {
          if (projectId) {
            onRefresh();
          }
        },
      });
    },
  });

  function onSuccessGetProjectDetail(data) {
    track(TrackingActions.productViewed, {
      category: Category.project,
      name: data?.projectName,
      investor: data?.investorOwnerName ?? '',
      project_type: data?.projectTypeDescription ?? '',
      project_status: data?.projectStatusDescription ?? '',
    });

    const status = getTransactionStatusByTime(projectDetail);
    setProjectStatus(status);
  }

  const onFollowSuccess = data => {
    updateProject(data?.projectDto);
    showMessageAlert(translate(STRINGS.SUCCESS), translate(Message.POM_MES_002_1));
    setProjectDetail({...projectDetail, isFollowed: true});
  };

  const onUnFollowSuccess = data => {
    updateProject(data?.projectDto);
    showMessageAlert(translate(STRINGS.SUCCESS), translate(Message.POM_MES_003_1));
    setProjectDetail({...projectDetail, isFollowed: false});
  };

  useEffect(() => {
    shouldRefresh && onRefresh();
  }, [shouldRefresh]);

  const {followProject} = useFollowProject({projectId, onSuccess: onFollowSuccess});
  const {unfollowProject} = useUnfollowProject({projectId, onSuccess: onUnFollowSuccess});
  const isFocused = useIsFocused();
  const {startInterval, stopInterval} = useInterval({
    handler: handleInterval,
    interval: CHECK_STATUS_INTERVAL,
  });

  useEffect(() => {
    if (!projectDetail?.saleSeasonInfo?.saleSeasonId) {
      return;
    }
    if (isFocused && shouldStartInterval({projectDetail})) {
      startInterval();
    } else if (!isFocused) {
      stopInterval();
    }
    return stopInterval;
  }, [isFocused, projectDetail]);

  function handleInterval() {
    if (projectDetail?.saleSeasonInfo?.saleSeasonId) {
      const newStatus = getTransactionStatusByTime(projectDetail);
      const closeDatetime = projectDetail?.saleSeasonInfo?.closeDatetime;
      if (moment().isAfter(moment(closeDatetime))) {
        stopInterval();
        if (projectId) {
          getProjectDetail(projectId);
        }
      }
      setProjectStatus(newStatus);
    }
  }

  useMountInteraction(() => {
    onRefresh();
  }, [projectId]);

  useEffect(() => {
    if (projectDetail?.saleSeasonInfo?.saleSeasonId) {
      const status = getTransactionStatusByTime(projectDetail);
      setProjectStatus(status);
    }

    if (projectDetail?.overviewMediaInfo) {
      const overviewMediaInfo = JsonDataUtils.parseJSONObject(projectDetail.overviewMediaInfo);
      setStreetviews(overviewMediaInfo.streetviews ?? []);
      setThreedviews(overviewMediaInfo.threedviews ?? []);
      setVideoviews(overviewMediaInfo.video ?? '');
    }
  }, [projectDetail]);

  const onRefresh = () => {
    if (projectId) {
      getProjectDetail(projectId);
    }
  };

  const onNeedAdvice = () => {
    if (projectDetail && projectId) {
      const params = getParamsNeedAdvice(projectDetail);

      track(TrackingActions.consultancyRequestClicked, {
        category: Category.project,
        name: params.postTitle,
      });

      navigation.navigate(ScreenIds.ContactToAdvice, params);
    }
  };

  const {startApi: validateRecaptcha} = useMutationGraphql({
    graphqlApiLazy: useValidateReCaptchaForPropertyPostBasketMutation,
    dataField: 'validateReCaptchaForPropertyPostBasket',
    showSpinner: true,
  });

  const onReserve = () => {
    resetState();
    // deposit => member và visitor có thể đi vào trong
    if (projectStatus === TRANSACTION_MODE.BOOKING) {
      if (notLoggedIn) {
        showLogin(() => {
          return;
        });
      } else if (isMemberUser) {
        setShowRegisterAgent(true);
      } else {
        checkLockedSlot({
          saleSeasonId: projectDetail?.saleSeasonInfo?.saleSeasonId,
        });
      }
    } else {
      checkBooking();
    }
  };

  const checkBooking = async () => {
    if (notLoggedIn) {
      captchaRef?.current?.show(captcha => isValidateCaptchaVisitor({captcha}));
    } else {
      checkBookingSuccess();
    }
  };

  const isValidateCaptchaVisitor = ({captcha}) => {
    validateRecaptcha(
      {
        variables: {
          request: {
            tokenCaptcha: captcha,
          },
        },
      },
      data => {
        if (!data.errorCode && data.requestId) {
          checkBookingSuccess({requestId: data.requestId});
        }
      },
    );
  };

  const onToggleFollowStatus = () => {
    showLogin(() => {
      if (projectDetail.isFollowed) {
        unfollowProject(projectId);
      } else {
        followProject(projectId);
        onSucceedFollow();
      }
    });
  };

  const onSucceedFollow = () => {
    track(TrackingActions.productFollowClicked, {
      click_location: ClickLocation.product,
      category: Category.project,
      name: projectDetail?.projectName ?? '',
      project_type: projectDetail?.projectTypeDescription ?? '',
      investor: projectDetail?.investorOwnerName ?? '',
    });
  };

  const onPress3D = () => {
    const link = threedviews[0].url;
    navigation.navigate(ScreenIds.Matterport, {link});
  };

  const onPressStreetview = () => {
    const coordinate = {
      latitude: streetviews[0].lat,
      longitude: streetviews[0].lng,
      radius: streetviews[0].radius,
    };
    navigation.navigate(ScreenIds.Streetview, {coordinate});
  };

  const onPressVideo = () => {
    navigation.navigate(ScreenIds.ImageHorizontalList, {videoviews});
  };

  const onPressPhotoLibrary = images => {
    navigation.navigate(ScreenIds.ImageHorizontalList, {images});
  };

  const goToInvestorDetail = (investorId, investorCode) => {
    if (investorId && investorCode) {
      navigation.navigate(ScreenIds.InvestorDetail, {investorCode, investorId});
    }
  };

  useEffect(() => {
    if (isFocused && needUpdateState.projectDetail) {
      onRefresh();
      setUpdateProjectDetail(false);
    }
  }, [isFocused, needUpdateState.projectDetail]);

  const onPressSimilarItem = item => {
    navigation.push(ScreenIds.ProjectDetail, {
      projectId: item.projectId,
    });
  };

  const onViewMoreProjectSimilar = () => {
    navigation.push(ScreenIds.Search, {
      isNewRouter: true,
      tabIndex: SEARCH_TYPE_INDEX.B2C,
      propertyTypeJson: [{id: projectDetail?.propertyTypeId}],
      placeJson: [
        {
          city: {
            checked: true,
            id: projectDetail.projectAddress?.cityId,
            name: projectDetail.projectAddress?.cityName,
          },
          districts: [
            {
              checked: true,
              id: projectDetail.projectAddress?.districtId,
              name: projectDetail.projectAddress?.districtName,
            },
          ],
        },
      ],
    });
  };

  const needShowMatterport = threedviews.filter(value => value.url).length > 0;
  const needShowStreetview = streetviews.filter(value => value.lat && value.lng).length > 0;
  const needShowVideoview = !isEmpty(videoviews);

  return (
    <Captcha ref={captchaRef}>
      <ProjectDetailContainer
        loading={loading}
        formatPrice={formatPrice}
        title={projectDetail?.projectName?.trim() ?? ''}
        onRefresh={onRefresh}
        projectDetail={projectDetail}
        address={address}
        needShowVideoview={needShowVideoview}
        needShowMatterport={needShowMatterport}
        needShowStreetview={needShowStreetview}
        onToggleFollowStatus={onToggleFollowStatus}
        projectStatus={projectStatus}
        onNeedAdvice={onNeedAdvice}
        projectSimilar={projectSimilar}
        isMemberUser={isMemberUser}
        onViewMoreProjectSimilar={onViewMoreProjectSimilar}
        onReserve={onReserve}
        isShowButtonBook={isShowButtonBook}
        onPressVideo={onPressVideo}
        onPress3D={onPress3D}
        onPressSimilarItem={onPressSimilarItem}
        updateProjectSimilar={updateProjectSimilar}
        onPressStreetview={onPressStreetview}
        onPressPhotoLibrary={onPressPhotoLibrary}
        onPressInvestor={goToInvestorDetail}
        notLoggedIn={notLoggedIn}
        showBottomView={showBottomView}
      />
      <RegisterAgentModal
        isShowModal={showRegisterAgentModal}
        setShowModal={setShowRegisterAgent}
      />
    </Captcha>
  );
};

export default ProjectDetailScreen;
