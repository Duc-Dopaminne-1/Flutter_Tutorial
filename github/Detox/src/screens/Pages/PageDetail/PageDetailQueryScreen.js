import includes from 'lodash/includes';
import React from 'react';

import {getStaticPageUrl} from '../../../api/userApi/staticPagesApi';
import {PAGE_CHILD_TYPE} from '../../../assets/constants';
import PageDetailContainer from './PageDetailContainer';

const excludePageType = [
  PAGE_CHILD_TYPE.OPERATION,
  PAGE_CHILD_TYPE.TERMS_OF_USE_INFO_GENERAL,
  PAGE_CHILD_TYPE.PRIVACY_POLICY,
  PAGE_CHILD_TYPE.MECHANISMS,
  PAGE_CHILD_TYPE.SERVICE_AGREEMENT,
  PAGE_CHILD_TYPE.TRAINING_PAGE,
];

const PageDetailQueryScreen = ({route}) => {
  const {isShowDate, query, isStaticPage = true, title = ''} = route?.params || {};

  const checkStaticPage = includes(excludePageType, query.pageType) === true ? false : isStaticPage;

  const autoPlayVideo = query?.pageType === PAGE_CHILD_TYPE.TRAINING_PAGE;

  const urlPage = getStaticPageUrl({
    pageType: query.pageType,
    isStaticPage: checkStaticPage,
    objectType: query.objectType,
  });

  return (
    <PageDetailContainer
      showSocialComment={false}
      title={title}
      detail={urlPage}
      isShowDate={isShowDate}
      isSubmenu={true}
      autoPlay={autoPlayVideo}
    />
  );
};

export default PageDetailQueryScreen;
