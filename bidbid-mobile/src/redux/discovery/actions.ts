import {
  DiscoveryActionTypes,
  ActionDiscovery,
  ActionDiscoveryDetail,
  ActionDiscoveryDetailPayload,
  ActionDiscoveryPayload,
  ActionSetIndexDiscovery,
  ActionSetIndexDiscoveryPayload,
  ActionLikeDiscovery,
  ActionLikeDiscoveryPayload,
  ActionUnLikeDiscovery,
  ActionUnLikeDiscoveryPayload,
  ActionSaveDiscovery,
  ActionSaveDiscoveryPayload,
  ActionSaveDiscoveryWithFilter,
  ActionBidMax,
  ActionBidMaxPayload,
  ActionIncreaseIndex,
  ActionTriggerEndTime,
  ActionRevertLikeDiscovery,
  ActionRevertLikeDiscoveryPayload,
  ActionSaveDiscoveryDetail,
  ActionSaveDiscoveryDetailPayload,
} from './index';

export function getDiscovery(payload: ActionDiscoveryPayload): ActionDiscovery {
  return {
    type: DiscoveryActionTypes.GET_DISCOVERY,
    payload,
  };
}

export function showDiscoveryLoading() {
  return {
    type: DiscoveryActionTypes.SHOW_DISCOVERY_LOADING,
  };
}

export function hideDiscoveryLoading() {
  return {
    type: DiscoveryActionTypes.HIDE_DISCOVERY_LOADING,
  };
}

export function getDiscoveryDetail(payload: ActionDiscoveryDetailPayload): ActionDiscoveryDetail {
  return {
    type: DiscoveryActionTypes.GET_DISCOVERY_DETAIL,
    payload,
  };
}

export function saveDiscoveryDetail(payload: ActionSaveDiscoveryDetailPayload): ActionSaveDiscoveryDetail {
  return {
    type: DiscoveryActionTypes.SAVE_DISCOVERY_DETAIL,
    payload,
  };
}

export function setIndexDiscovery(payload: ActionSetIndexDiscoveryPayload): ActionSetIndexDiscovery {
  return {
    type: DiscoveryActionTypes.SET_INDEX_DISCOVERY,
    payload,
  };
}

export function likeDiscovery(payload: ActionLikeDiscoveryPayload): ActionLikeDiscovery {
  return {
    type: DiscoveryActionTypes.LIKE_DISCOVERY,
    payload,
  };
}

export function revertLikeDiscovery(payload: ActionRevertLikeDiscoveryPayload): ActionRevertLikeDiscovery {
  return {
    type: DiscoveryActionTypes.REVERT_LIKE_DISCOVERY,
    payload,
  };
}

export function unlikeDiscovery(payload: ActionUnLikeDiscoveryPayload): ActionUnLikeDiscovery {
  return {
    type: DiscoveryActionTypes.UN_LIKE_DISCOVERY,
    payload,
  };
}

export function saveDiscovery(payload: ActionSaveDiscoveryPayload): ActionSaveDiscovery {
  return {
    type: DiscoveryActionTypes.SAVE_DISCOVERY,
    payload,
  };
}

export function saveDicoveryWithFilter(payload: ActionSaveDiscoveryPayload): ActionSaveDiscoveryWithFilter {
  return {
    type: DiscoveryActionTypes.SAVE_DISCOVERY_WITH_FILTER,
    payload,
  };
}

export function increaseIndex(): ActionIncreaseIndex {
  return {
    type: DiscoveryActionTypes.INCREASE_INDEX,
  };
}

export function bidMaxDiscovery(payload: ActionBidMaxPayload): ActionBidMax {
  return {
    type: DiscoveryActionTypes.BID_MAX,
    payload,
  };
}

export function setTriggerEndTime(): ActionTriggerEndTime {
  return {
    type: DiscoveryActionTypes.TRIGGER_END_TIME,
  };
}
