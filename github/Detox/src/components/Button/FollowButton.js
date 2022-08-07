import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';

import {AppContext} from '../../appData/appContext/useAppContext';
import {LastModifiedContext} from '../../appData/lastModifiedContext/useLastModifiedContext';
import {UPDATE_ITEM_STRATEGY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {useLogin} from '../../screens/Auth/useLogin';
import {
  useFollowPropertyPost,
  useUnfollowPropertyPost,
} from '../../screens/ManagePost/usePropertyPostActions';
import {useFollowProject, useUnfollowProject} from '../../screens/ProjectDetail/useProjectActions';
import useDeepCompareEffect from '../../utils/useDeepCompareEffect';
import EyeFollowButton from './EyeFollowButton';

const IgnoreErrorList = ['MPJ_ERR_006', 'PO_ERR_002', 'PO_ERR_004', 'MPJ_ERR_007'];

const notifyItemChange = ({unfollowStrategy, followStrategy, isFollowed, actions, item}) => {
  if (
    (!isFollowed && unfollowStrategy === UPDATE_ITEM_STRATEGY.REMOVE_FROM_LIST) ||
    (isFollowed && followStrategy === UPDATE_ITEM_STRATEGY.REMOVE_FROM_LIST)
  ) {
    actions.removeItem(item);
  } else {
    actions.updateItem(item);
  }
};
const shouldUpdateData = (data, id, idFieldName, isFollowed) => {
  const idValue = data[idFieldName];
  return !isEmpty(idValue) && idValue === id && data.isFollowed !== isFollowed;
};

const getSuccessMessage = ({projectId, isFollowed}) => {
  if (projectId) {
    return isFollowed ? translate(Message.POM_MES_002_1) : translate(Message.POM_MES_003_1);
  }
  return isFollowed ? translate(Message.POM_MES_002) : translate(Message.POM_MES_003);
};

const FollowButton = ({
  actions = {updateItem: () => {}},
  isFollowed,
  followerCount = 0,
  unfollowStrategy,
  followStrategy,
  projectId = '',
  isProperty,
  customStyle = {},
  propertyPostId = '',
  isHeartIcon = false,
  customIcon,
  isBanner,
  imageStyle,
  onFollowSuccess = () => {},
  onUnFollowSuccess = () => {},
}) => {
  const {
    state: {project, property} = {project: null, property: null},
    updateProject: updateProjectForContext,
    updateProperty: updatePropertyForContext,
  } = useContext(LastModifiedContext);
  const {showMessageAlert, showErrorAlert} = useContext(AppContext);
  const {showLogin} = useLogin();

  useDeepCompareEffect(() => {
    if (shouldUpdateData(project, projectId, 'projectId', isFollowed)) {
      onUpdateProjectSuccess(project, project?.isFollowed, false);
    }
  }, [project]);

  useDeepCompareEffect(() => {
    if (shouldUpdateData(property, propertyPostId, 'propertyPostId', isFollowed)) {
      onUpdatePropertySuccess(property, property.isFollowed, false);
    }
  }, [property]);

  const defaultHandlingError = error => {
    if (error) {
      const errorMessage = error.errorMessage || error.errorCode || error.errorMessageCode;
      showErrorAlert(errorMessage);
    }
  };

  function onUpdateItemSuccess({
    isFollowedResponse,
    projectIdParam,
    propertyPostIdParam,
    shouldShowAlert = true,
  }) {
    if (shouldShowAlert) {
      showMessageAlert(
        translate(STRINGS.SUCCESS),
        getSuccessMessage({
          projectId: projectIdParam,
          propertyPostId: propertyPostIdParam,
          isFollowed: isFollowedResponse,
        }),
      );
    }
    const changedFollower = isFollowedResponse ? 1 : -1;
    const updatedItem = {
      ...(projectIdParam ? {projectId: projectIdParam} : {propertyPostId: propertyPostIdParam}),
      isFollowed: isFollowedResponse,
      totalFollower: Math.max(followerCount + changedFollower, 0),
    };
    notifyItemChange({
      unfollowStrategy,
      followStrategy,
      isFollowed: isFollowedResponse,
      actions,
      item: updatedItem,
    });
    if (projectId) {
      updateProjectForContext(updatedItem);
    } else {
      updatePropertyForContext(updatedItem);
    }
  }

  //#region Handling action for project
  function onUpdateProjectSuccess(_response, isFollowedResponse, shouldShowAlert = true) {
    onUpdateItemSuccess({
      isFollowedResponse,
      shouldShowAlert,
      projectIdParam: projectId,
    });
  }

  const onUpdateProjectError = (error, isFollowedResponse) => {
    defaultHandlingError(error);
    if (IgnoreErrorList.includes(error.errorMessageCode)) {
      onUpdateProjectSuccess({}, isFollowedResponse, false);
    }
  };

  const {followProject} = useFollowProject({
    projectId: projectId ?? '',
    onSuccess: response => {
      onFollowSuccess();
      onUpdateProjectSuccess(response, true);
    },
    onError: error => onUpdateProjectError(error, true),
  });

  const {unfollowProject} = useUnfollowProject({
    projectId: projectId ?? '',
    onSuccess: response => {
      onUnFollowSuccess?.();
      onUpdateProjectSuccess(response, false);
    },
    onError: error => onUpdateProjectError(error, false),
  });
  //#endregion
  //#region Handling action for property
  function onUpdatePropertySuccess(_response, isFollowedResponse, shouldShowAlert = true) {
    onUpdateItemSuccess({
      isFollowedResponse,
      shouldShowAlert,
      propertyPostIdParam: propertyPostId,
    });
  }

  const onUpdatePropertyError = (error, isFollowedResponse) => {
    defaultHandlingError(error);
    if (IgnoreErrorList.includes(error.errorMessageCode)) {
      onUpdatePropertySuccess({}, isFollowedResponse, false);
    }
  };

  const {followPropertyPostAction} = useFollowPropertyPost({
    propertyPostId: propertyPostId ?? '',
    onSuccess: response => {
      onFollowSuccess?.();
      onUpdatePropertySuccess(response, true);
    },
    onError: error => onUpdatePropertyError(error, true),
  });

  const {unfollowPropertyPostAction} = useUnfollowPropertyPost({
    propertyPostId: propertyPostId ?? '',
    onSuccess: response => {
      onUnFollowSuccess?.();
      onUpdatePropertySuccess(response, false);
    },
    onError: error => onUpdatePropertyError(error, false),
  });
  //#endregion

  const onPressFollowButton = () => {
    showLogin(() => {
      if (projectId) {
        isFollowed ? unfollowProject() : followProject();
      } else if (propertyPostId) {
        isFollowed ? unfollowPropertyPostAction() : followPropertyPostAction();
      }
    });
  };

  return (
    <EyeFollowButton
      isProperty={isProperty}
      customStyle={customStyle}
      isFollowed={isFollowed}
      onPress={onPressFollowButton}
      isHeartIcon={isHeartIcon}
      customIcon={customIcon}
      isBanner={isBanner}
      totalFollower={followerCount}
      imageStyle={imageStyle}
    />
  );
};

export default FollowButton;
