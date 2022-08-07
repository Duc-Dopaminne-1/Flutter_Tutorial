import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  useFollowFeedItemMutation,
  useGetTotalFollowerByFeedObjectIdForFrontOfficeLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/appContext';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {small} from '../../assets/theme/metric';
import {useLogin} from '../../screens/Auth/useLogin';
import {useMount} from '../../screens/commonHooks';
import {getCommentObjectType} from '../../utils/GetMasterData';

const styles = StyleSheet.create({
  textLikeNumber: {fontSize: 14, marginLeft: small},
});

const hipSlot = {top: small, bottom: small, left: small, right: small};

export const SocialFollowButton = ({
  feedObjectId,
  feedObjectTitle,
  feedObjectTypeId,
  colorTheme = COLORS.PRIMARY_A100,
  onSucceedFollow,
  visibleTotalFollower = true,
}) => {
  const [isFollowInfo, setFollowInfo] = React.useState({});
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const {typeId} = getCommentObjectType(masterData, feedObjectTypeId);
  const {showLogin} = useLogin();
  const {startApi: getTotalFollow} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTotalFollowerByFeedObjectIdForFrontOfficeLazyQuery,
    dataField: 'getTotalFollowerByFeedObjectIdForFrontOffice',
    onSuccess: data => {
      setFollowInfo(data);
    },
    onError: () => {},
    showSpinner: false,
  });

  const {startApi} = useMutationGraphql({
    showSpinner: false,
    graphqlApiLazy: useFollowFeedItemMutation,
  });

  useMount(() => {
    getTotalFollow({
      variables: {
        feedObjectId: feedObjectId,
      },
    });
  });

  const onSucceedFollowPost = () => {
    onSucceedFollow && onSucceedFollow();
  };

  const onPressFollow = () => {
    showLogin(() => {
      const totalFollow = isFollowInfo.totalFollower;
      const isFollow = isFollowInfo.currentUserFollowFeedItem;
      setFollowInfo(prev => ({
        ...prev,
        ...(prev.totalFollower = isFollow ? totalFollow - 1 : totalFollow + 1),
        ...(prev.currentUserFollowFeedItem = !isFollow),
      }));
      startApi(
        {
          variables: {
            input: {
              feedObjectId: feedObjectId,
              feedObjectTypeId: typeId,
              feedObjectTitle: feedObjectTitle,
              isFollowFeedItem: !isFollow,
            },
          },
        },
        onSucceedFollowPost,
      );
    });
  };

  const color = isFollowInfo?.currentUserFollowFeedItem ? colorTheme : COLORS.GRAY_BD;
  const totalFollower = isFollowInfo?.totalFollower ?? 0;
  return (
    <TouchableOpacity onPress={onPressFollow} hitSlop={hipSlot} style={HELPERS.rowCenter}>
      <Icon name={'heart'} color={color} size={24} />
      {!!(visibleTotalFollower && totalFollower) && (
        <Text style={[styles.textLikeNumber, {color: color}]}>{totalFollower}</Text>
      )}
    </TouchableOpacity>
  );
};
