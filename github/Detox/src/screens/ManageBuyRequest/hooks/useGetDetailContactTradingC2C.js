import isEmpty from 'lodash/isEmpty';
import {useContext, useRef} from 'react';

import {PropertyPostDto} from '../../../api/graphql/generated/graphql';
import {ContactTradingContext} from '../useContactTrading';
import useGetContactTradingById from './useGetContactTradingById';
import GetPropertyPostById from './useGetPropertyPostById';

const useGetDetailContactTradingC2C = isSending => {
  const {setContactTradingInfoC2C, updateContactTradingInfo} = useContext(ContactTradingContext);

  const contactTrading = useRef();
  const needUpdate = useRef();

  const onSuccessGetCT = data => {
    const propertyPostId = data?.propertyPostId ?? '';
    if (!isEmpty(propertyPostId)) {
      startGetPropertyPostInfoById(propertyPostId);
    }
    const requestInfo = data?.contactTradingInfo ?? {};

    contactTrading.current = requestInfo;

    if (needUpdate.current) {
      updateContactTradingInfo(requestInfo);
    }
  };

  const onSuccessGetProperty = (data: PropertyPostDto) => {
    const propertyPostId = contactTrading.current?.propertyPostId ?? '';

    if (!isEmpty(propertyPostId) && data) {
      setContactTradingInfoC2C(contactTrading.current, data, isSending);
    }
  };

  const [startGetPropertyPostInfoById] = GetPropertyPostById(() => {}, onSuccessGetProperty);

  const {getContactTradingById, loading} = useGetContactTradingById({
    onSuccessResponse: onSuccessGetCT,
  });

  const getContactTradingC2C = (requesterId, isUpdate = false) => {
    needUpdate.current = isUpdate;
    getContactTradingById(requesterId);
  };

  return {getContactTradingC2C, loading};
};

export default useGetDetailContactTradingC2C;
