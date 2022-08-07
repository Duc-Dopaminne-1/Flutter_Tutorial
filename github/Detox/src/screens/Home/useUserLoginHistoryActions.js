import {useDispatch} from 'react-redux';

import {updateLoginHistory} from '../../api/authApi';
import {useApiCall} from '../../api/restful/useApiCall';
import * as userActions from '../../appData/user/actions';
import {getNowTimeStamp} from '../../utils/TimerCommon';

const useUpdateUserLoginHistory = ({onSuccess, onError}) => {
  const dispatch = useDispatch();

  const onSuccessUpdateData = () => {
    dispatch(userActions.setFirstLogin(false));
    onSuccess && onSuccess();
  };

  const onErrorUpdateData = error => {
    dispatch(userActions.setFirstLogin(false));
    onError && onError(error);
  };

  const {startApi} = useApiCall({onError: onErrorUpdateData, onSuccess: onSuccessUpdateData});

  const startUpdateUserLoginHistory = () => {
    startApi(async () => {
      const newInput = {
        isFirstLogin: false,
        lastLoginDatetime: getNowTimeStamp(),
      };
      const response = await updateLoginHistory(newInput);
      return response;
    });
  };

  return {startUpdateUserLoginHistory};
};

export {useUpdateUserLoginHistory};
