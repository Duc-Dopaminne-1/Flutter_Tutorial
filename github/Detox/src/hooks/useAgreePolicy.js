import {useRef, useState} from 'react';

import {getBasicArticlePageApi} from '../api/userApi';
import {getLanguageCodeShort} from '../assets/localize';
import {useMount} from '../screens/commonHooks';

export const useAgreePolicy = (pageType = 'privacyPolicyPersonal', defaultValue = false) => {
  const [html, setHtml] = useState();
  const [isAgree, setAgree] = useState(defaultValue);
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef?.current?.open();
  };

  const agreeAndCloseModal = () => {
    setAgree(true);
    modalRef?.current?.close();
  };

  useMount(() => {
    getBasicArticlePageApi({
      variables: {
        languageCode: getLanguageCodeShort(),
        pageType,
      },
    }).then(response => {
      if (response.data.length > 0) {
        const body = response.data[0].body;
        setHtml(body);
      }
    });
  });

  return {
    html,
    isAgree,
    modalRef,
    setAgree,
    openModal,
    agreeAndCloseModal,
  };
};
