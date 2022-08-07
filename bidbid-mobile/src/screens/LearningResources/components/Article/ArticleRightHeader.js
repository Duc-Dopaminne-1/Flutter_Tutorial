import React, {useContext} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Share from 'react-native-share';

import {AppContext} from '../../../../appData/appContext/appContext';
import {COMMENT_OBJECT_TYPES} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {HELPERS} from '../../../../assets/theme/helpers';
import {commonStyles} from '../../../../assets/theme/styles';
import {ShareIcon} from '../../../../components/ShareIcon';
import Configs from '../../../../configs';
import ScreenIds from '../../../ScreenIds';

type ArticleRightHeaderProps = {
  navigation: any,
  articleId: string,
  title: string,
  articleSlug: string,
};

const ArticleRightHeader = ({
  navigation,
  articleId,
  // title, // TODO integration share title
  articleSlug,
}: ArticleRightHeaderProps) => {
  const {showMessageAlert} = useContext(AppContext);
  const onPressComment = () => {
    navigation.navigate(ScreenIds.CommentDetail, {
      objectId: articleId,
      feedObjectTypeId: COMMENT_OBJECT_TYPES.NEWS,
    });
  };

  const onPressShare = () => {
    const shareUrl = `${Configs.portal.PORTAL_URL}/kien-thuc/${articleId}-${articleSlug}`;
    const contentShare = {
      url: shareUrl,
      message: shareUrl,
    };
    Share.open(contentShare)
      .then(() => {
        showMessageAlert(translate(STRINGS.SUCCESS), translate('learningResources.shareSuccess'));
      })
      .catch(() => {});
  };

  return (
    <View style={HELPERS.row}>
      <CommentIcon onPress={onPressComment} />
      <View style={commonStyles.separatorColumn24} />
      <ShareIcon hideLabel hideMarginRight onPress={onPressShare} />
    </View>
  );
};

const CommentIcon = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={IMAGES.IC_MESSAGE_FILL} />
    </TouchableOpacity>
  );
};

export default ArticleRightHeader;
