import React from 'react';

import {confirmOtp, postMobilePhone} from '../../../api/authApi';
import ScreenIds from '../../ScreenIds';
import ConfirmOTPComponent from '../AuthComponents/ConfirmOTPComponent';

const ConfirmOTPScreen = ({route, navigation}) => {
  const {mobilePhone, nextScreenId, inviteCode} = route?.params || {};
  const onSuccessConfirmOtp = data => {
    if (nextScreenId === ScreenIds.InfoAccount) {
      navigation.replace(ScreenIds.StepSignUp, {
        screen: ScreenIds.InfoAccount,
        params: {mobilePhone, otpKey: data?.data?.otpKey, inviteCode},
      });
    } else {
      navigation.replace(nextScreenId, {mobilePhone, otpKey: data?.data?.otpKey, inviteCode});
    }
  };

  return (
    <ConfirmOTPComponent
      mobilePhone={mobilePhone}
      confirmOtpApi={confirmOtp}
      successCallback={onSuccessConfirmOtp}
      sendAgainApi={postMobilePhone}
    />
  );
};

export default ConfirmOTPScreen;
