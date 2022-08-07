import React from 'react';

import {ShareIcon} from '../../../components/ShareIcon';
import {FeatureConfig} from '../../../configs/FeatureConfig';
import {useShare} from '../../../hooks/useShare';
import styles from './styles';

export const ShareControl = ({state, setState}) => {
  const postId = state.originState?.propertyPostId;
  const postTitle = state.originState?.postTitle;
  const totalShare = state.originState?.totalShare ?? 0;
  const {showShare} = useShare({
    postId: postId,
    message: postTitle,
    title: postTitle,
    onAfterShare: () => {
      setState({...state, originState: {...state.originState, totalShare: totalShare + 1}});
    },
  });

  if (FeatureConfig.disableShareSocial) {
    return null;
  }

  return <ShareIcon style={styles.shareIcon} onPress={showShare} />;
};
