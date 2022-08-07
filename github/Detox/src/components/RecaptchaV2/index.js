import React, {forwardRef, useImperativeHandle} from 'react';

import {translate} from '../../assets/localize';
import Configs, {getConfigs} from '../../configs';
import CaptchaModal from './CaptchaModal';

const CaptchaV2 = forwardRef(({onSendToken}, ref) => {
  const captchaRef = React.useRef(null);

  const onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        captchaRef?.current.hide();
        return;
      } else {
        onSendToken(event?.nativeEvent?.data);
        captchaRef?.current.hide();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      captchaRef?.current.show();
    },
  }));

  return (
    <CaptchaModal
      ref={captchaRef}
      siteKey={getConfigs().recaptcha.RECAPTCHA_SITE_KEY}
      baseUrl={Configs.portal.PORTAL_URL}
      onMessage={onMessage}
      cancelButtonText={translate('common.cancel')}
    />
  );
});

export default CaptchaV2;
