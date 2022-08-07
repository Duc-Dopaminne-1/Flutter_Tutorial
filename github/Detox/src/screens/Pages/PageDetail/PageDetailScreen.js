import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import ScreenIds from '../../ScreenIds';
import {TrackingActions} from '../../WithSegment';
import PageDetailContainer from './PageDetailContainer';

const PageDetailScreen = ({route, navigation}) => {
  const {
    pageDetail: detail,
    isShowDate,
    title = '',
    hotNews = [],
    emptyCommentMessage,
    showHotNews = false,
  } = route?.params || {};
  const {track} = useAnalytics();

  const onPressHotNewsItem = data => {
    if (data) {
      track(TrackingActions.newsClicked, {
        category: data?.category ?? '',
        name: data?.title ?? '',
      });

      navigation.push(ScreenIds.PageDetail, {
        pageDetail: data,
        isShowDate: true,
        title: translate(STRINGS.DETAIL),
        showHotNews: true,
      });
    }
  };

  return (
    <PageDetailContainer
      title={title}
      detail={detail}
      isShowDate={isShowDate}
      hotNews={hotNews}
      onPressHotNewsItem={onPressHotNewsItem}
      noMarginContent
      emptyCommentMessage={emptyCommentMessage}
      showHotNews={showHotNews}
    />
  );
};

export default PageDetailScreen;
