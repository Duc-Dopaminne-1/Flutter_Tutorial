import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {DEFAULT_RATING_VALUE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import RatingComponent from '../../../components/Rating/RatingComponent';
import {getUserFullName} from '../../../utils/UserAgentUtil';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normal,
  },
  description: {...FONTS.semiBold, fontSize: 15, color: COLORS.TEXT_DARK_10, paddingTop: normal},
  avatar: {
    paddingVertical: normal,
  },
  agentName: {...FONTS.bold, fontSize: 18, color: COLORS.TEXT_DARK_10, paddingTop: normal},
});

const AVATAR_SIZE = 150;
const IMAGE_RATING = 23;

const ReviewAgentInfo = ({agentInfo, rating, isSale = true, readonly = false, onFinishRating}) => {
  return (
    <>
      <View style={[HELPERS.center]}>
        <Text style={styles.description}>
          {isSale
            ? translate(STRINGS.REVIEW_SALE_AGENT_DESCRIPTION)
            : translate(STRINGS.REVIEW_BUY_AGENT_DESCRIPTION)}
        </Text>
        <Avatar containerStyle={styles.avatar} size={AVATAR_SIZE} url={agentInfo?.profilePhoto} />
        <RatingComponent
          rateNumber={rating}
          imageSize={IMAGE_RATING}
          readonly={readonly}
          isProcess={false}
          defaultRating={DEFAULT_RATING_VALUE}
          onFinishRating={onFinishRating}
        />
        <Text style={styles.agentName}>{agentInfo ? getUserFullName(agentInfo) : ''}</Text>
      </View>
    </>
  );
};

export default ReviewAgentInfo;
