import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import MeasureUtils from '../../../utils/MeasureUtils';
import {getUserFullName} from '../../../utils/UserAgentUtil';

const AVATAR_SIZE = 50;

const PADDING_CONTAINER = 10;
const MARGIN_LEFT_VIEW_BESIDE_IMAGE = 10;
const MARGIN_RIGHT_COLUMN_NAME = 10;
const IMAGE_ARROW_SIZE = 20;
const LINE_SEPARATOR_HEIGHT = 1;
const MARGIN_TOP_MEMBER_TEXT = 8;

const NAME_WIDTH_HARD =
  Dimensions.get('window').width -
  PADDING_CONTAINER * 2 -
  AVATAR_SIZE -
  MARGIN_LEFT_VIEW_BESIDE_IMAGE -
  MARGIN_RIGHT_COLUMN_NAME -
  IMAGE_ARROW_SIZE;

const styles = StyleSheet.create({
  viewParent: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  viewContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  viewBesideImage: {
    marginLeft: MARGIN_LEFT_VIEW_BESIDE_IMAGE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  textName: {
    ...FONTS.semiBold,
    fontSize: 15,
  },
  viewColumnName: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginRight: MARGIN_RIGHT_COLUMN_NAME,
    flexShrink: 1,
  },
  labelMember: {
    ...FONTS.regular,
    fontSize: 13,
    marginTop: MARGIN_TOP_MEMBER_TEXT,
  },
  textRankName: {
    ...FONTS.bold,
    fontSize: 10,
    paddingTop: 3,
  },
  viewRankAndArrow: {
    flexDirection: 'row',
  },
  imageArrowRight: {
    height: IMAGE_ARROW_SIZE,
    width: IMAGE_ARROW_SIZE,
  },
  lineSeparator: {
    marginHorizontal: normal,
    height: LINE_SEPARATOR_HEIGHT,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
});

const getFullTextRank = agentRankingDescription => {
  return translate(STRINGS.AGENT) + ' ' + agentRankingDescription;
};

const getPositionText = isAgentLeader => {
  return isAgentLeader ? translate(STRINGS.TEAM_LEAD) : translate(STRINGS.MEMBER);
};

export const getHeightForMemberItem = async item => {
  const fullName = getUserFullName(item);
  const memberSize = await MeasureUtils.measureTextSize({
    text: getPositionText(item.isAgentLeader),
    fontSize: 13,
    ...FONTS.regular,
    lineInfoForLine: 1,
  });
  const rankSize = await MeasureUtils.measureTextSize({
    text: getFullTextRank(item.agentRankingDescription),
    fontSize: 10,
    ...FONTS.bold,
    lineInfoForLine: 1,
  });
  const NAME_WIDTH = NAME_WIDTH_HARD - rankSize.width;
  const nameSize = await MeasureUtils.measureTextSize({
    text: fullName,
    ...styles.textName,
    width: NAME_WIDTH,
  });
  const padding = Platform.OS === 'android' ? 3 : 0;
  const avaSize = AVATAR_SIZE;
  const columnNameSize = nameSize.height + memberSize.height + MARGIN_TOP_MEMBER_TEXT + padding;
  return Math.max(avaSize, columnNameSize) + PADDING_CONTAINER * 2 + LINE_SEPARATOR_HEIGHT;
};

const MemberItem = ({item, onPress, needShowSeparator = false}) => {
  return (
    <TouchableHighlight
      onPress={() => {
        onPress && onPress(item);
      }}>
      <View style={[styles.viewParent, {height: item.height}]}>
        <View style={styles.viewContainer}>
          <Avatar url={item.profilePhoto} size={AVATAR_SIZE} />
          <View style={styles.viewBesideImage}>
            <View style={styles.viewColumnName}>
              <Text style={styles.textName}>{getUserFullName(item)}</Text>
              <Text style={styles.labelMember}>{getPositionText(item.isAgentLeader)}</Text>
            </View>
            <View style={styles.viewRankAndArrow}>
              <Text style={styles.textRankName}>
                {getFullTextRank(item.agentRankingDescription)}
              </Text>
              <Image style={styles.imageArrowRight} source={IMAGES.IC_CHEVRON_RIGHT} />
            </View>
          </View>
        </View>
        {needShowSeparator && <View style={styles.lineSeparator} />}
      </View>
    </TouchableHighlight>
  );
};

export default MemberItem;
