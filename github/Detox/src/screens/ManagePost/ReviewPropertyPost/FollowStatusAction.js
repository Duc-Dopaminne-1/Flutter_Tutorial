import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {ICONS} from '../../../assets/icons';
import CustomIcon from '../../../assets/icons/CustomIcon';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {HELPERS} from '../../../assets/theme/helpers';
import styles from './styles';

const FollowStatusAction = ({
  isVisible = true,
  isFollowed,
  onPress,
  showFollowCount = false,
  followerCount = 0,
}) => {
  if (!isVisible) {
    return null;
  }
  const statusText = isFollowed
    ? translate(STRINGS.FOLLOWING_STATUS)
    : translate(STRINGS.UNFOLLOWING_STATUS);

  return (
    <View style={styles.followStatusViewContainer}>
      <View style={HELPERS.row}>
        <TouchableOpacity style={styles.followButton} onPress={onPress}>
          <Text style={styles.followStatusText}>{statusText}</Text>
          <CustomIcon name={ICONS.CHECK} size={16} />
        </TouchableOpacity>
      </View>
      {showFollowCount && (
        <Text style={styles.followCountText}>
          {translate(STRINGS.NUMBER_OF_FOLLOWERS, {followerCount})}
        </Text>
      )}
    </View>
  );
};

export default FollowStatusAction;
