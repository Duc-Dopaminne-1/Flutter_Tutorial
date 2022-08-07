import { Discovery } from '@/services/discovery';
import {
  ActionDiscoveryDetailPayload,
  ActionDiscoveryPayload,
  ActionLikeDiscoveryPayload,
  ActionUnLikeDiscoveryPayload,
  ActionRevertLikeDiscoveryPayload,
} from './index';

export const getDiscovery = async (param: ActionDiscoveryPayload) => {
  try {
    const response = await Discovery.getDiscovery(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getDiscoveryDetail = async (param: ActionDiscoveryDetailPayload) => {
  try {
    const response = await Discovery.getDiscoveryDetail(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setLikeDiscovery = async (param: ActionLikeDiscoveryPayload) => {
  try {
    const response = await Discovery.setLikeDiscovery(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setRevertLikeDiscovery = async (param: ActionRevertLikeDiscoveryPayload) => {
  try {
    const response = await Discovery.setRevertLikeDiscovery(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const setUnLikeDiscovery = async (param: ActionUnLikeDiscoveryPayload) => {
  try {
    const response = await Discovery.setUnLikeDiscovery(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getTotalDonate = async (param: ActionDiscoveryDetailPayload) => {
  try {
    const response = await Discovery.getTotalDonate(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
