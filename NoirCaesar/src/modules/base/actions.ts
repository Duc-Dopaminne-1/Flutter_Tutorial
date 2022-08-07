import { CommonActionType } from './index';

const resetAllState = () => {
  return {
    type: CommonActionType.RESET_ALL_STATE,
  };
};

export { resetAllState };
