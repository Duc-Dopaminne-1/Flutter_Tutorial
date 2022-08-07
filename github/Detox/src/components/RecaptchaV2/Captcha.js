import isEmpty from 'lodash/isEmpty';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {callAfterInteraction} from '../../screens/commonHooks';
import CaptchaV2 from '.';

let callBackGetCaptchaSuccess = null;

export const Captcha = forwardRef(({children}, ref) => {
  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState('');

  useEffect(() => {
    if (captchaToken && !isEmpty(captchaToken)) {
      callAfterInteraction(() => {
        callBackGetCaptchaSuccess && callBackGetCaptchaSuccess(captchaToken);
        callBackGetCaptchaSuccess = null;
      });
    }
  }, [captchaToken]);

  useImperativeHandle(ref, () => ({
    show: (callback: (captchaToken: String) => {}) => {
      callBackGetCaptchaSuccess = callback;
      captchaRef?.current?.show();
    },
  }));

  return (
    <>
      {children}
      <CaptchaV2 ref={captchaRef} onSendToken={setCaptchaToken} />
    </>
  );
});
