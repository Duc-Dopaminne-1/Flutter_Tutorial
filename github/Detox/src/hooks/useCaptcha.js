import {useState} from 'react';

const initialState = {
  captchaBase64Img: '',
};

export const useCaptcha = () => {
  const [captchaState, setCaptchaState] = useState(initialState);

  const onGetCaptchaError = () => {
    setCaptchaState({...captchaState, captchaBase64Img: null});
  };

  // const onGetCaptchaSuccess = captchaInfo => {
  //   setCaptchaState({
  //     ...captchaState,
  //     captchaBase64Img: captchaInfo?.base64Captcha ?? '',
  //   });
  // };

  // const {startApi: startGetCaptchaImage} = useGraphqlApiLazy({
  //   queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
  //   graphqlApiLazy,
  //   dataField,
  //   onSuccess: onGetCaptchaSuccess,
  //   onError: onGetCaptchaError,
  //   showSpinner: false,
  // });

  return {
    startGetCaptchaImage: () => {
      onGetCaptchaError();
    },
    captchaState,
  };
};
