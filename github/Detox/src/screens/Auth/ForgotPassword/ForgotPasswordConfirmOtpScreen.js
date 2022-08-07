import React from 'react';

import {forgotPassword, forgotPasswordConfirmOtp} from '../../../api/authApi';
import ConfirmOTPComponent from '../AuthComponents/ConfirmOTPComponent';

const ForgotPasswordConfirmOTPScreen = ({route, navigation}) => {
  const {mobilePhone, nextScreenId} = route?.params || {};
  const onSuccessConfirmOtp = data => {
    const username = data?.data?.username;
    const otpKey = data?.data?.otpKey;
    navigation.navigate(nextScreenId, {mobilePhone, username, otpKey});
  };

  return (
    <ConfirmOTPComponent
      mobilePhone={mobilePhone}
      confirmOtpApi={forgotPasswordConfirmOtp}
      successCallback={onSuccessConfirmOtp}
      sendAgainApi={forgotPassword}
    />
  );
};

export default ForgotPasswordConfirmOTPScreen;
