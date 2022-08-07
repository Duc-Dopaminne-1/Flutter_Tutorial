import Share from 'react-native-share';

import {
  useShareProjectByIdMutation,
  useSharePropertyPostByIdMutation,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import Configs from '../configs';
import {callAfterInteraction} from '../screens/commonHooks';

export const useShare = ({message, title, projectId, postId, onAfterShare, news}) => {
  let url, query;
  const input = {};
  if (projectId) {
    url = `${Configs.portal.PORTAL_URL}/chi-tiet/du-an/${projectId}`;
    input.projectId = projectId;
    query = useShareProjectByIdMutation;
  } else if (news && news?.id && news?.slug) {
    url = `${Configs.portal.PORTAL_URL}/static/news/${news.id}/${news.slug}`;
    input.newsId = news.id;
    query = useShareProjectByIdMutation;
  } else {
    url = `${Configs.portal.PORTAL_URL}/chi-tiet/nha-le/${postId}`;
    input.propertyPostId = postId;
    query = useSharePropertyPostByIdMutation;
  }
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: query,
    dataField: '',
    onSuccess: () => {},
    onError: () => {},
    showSpinner: false,
  });
  const callToUpdateShareApi = () => {
    startApi({
      variables: {
        input,
      },
    });
  };
  const onPressShare = async () => {
    const contentShare = {
      url,
      message: message,
      title: title,
      subject: title,
    };
    Share.open(contentShare)
      .then(() => {
        callAfterInteraction(() => {
          callToUpdateShareApi();
          onAfterShare && onAfterShare();
        });
      })
      .catch(() => {
        // do nothing
      });
  };

  const showShare = () => {
    onPressShare();
  };

  return {showShare};
};
