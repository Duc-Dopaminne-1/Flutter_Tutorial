import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import {MAP_PROPERTY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {getFullSizeImageDimension, SCREEN_SIZE} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import {getUserFullName} from '../../utils/UserAgentUtil';
import Avatar from '../Avatar';
import {Group} from '../Badge';
import RatingComponent from '../Rating/RatingComponent';
import {defaultAgent} from './types';

const fullSize = getFullSizeImageDimension();
const ICON_MEMBER_SIZE = 52;

export const ItemHeight = async agentInfo => {
  let itemHeight = 264;
  const fullName = getUserFullName(agentInfo);
  const nameSize = await MeasureUtils.measureTextSize({
    text: fullName,
    width: SCREEN_SIZE.WIDTH - 60,
    lineInfoForLine: 2,
  });
  if (JSON.parse(agentInfo.preferPropertyTypes).length > 2) {
    itemHeight += 45;
  }
  return itemHeight + nameSize.height;
};

const AgentInfo = ({avatar, name, rateNumber}) => {
  return (
    <View style={styles.viewInvestor}>
      <Avatar
        containerStyle={styles.avatarViewer}
        resizeMode={'contain'}
        url={avatar}
        size={ICON_MEMBER_SIZE}
      />
      <View style={styles.nameAgent}>
        <Text numberOfLines={2} style={styles.textOwnerName}>
          {name}
        </Text>
        <Group />
        <RatingComponent
          showRatingText
          backgroundColor={COLORS.NEUTRAL_WHITE}
          rateNumber={rateNumber}
          imageSize={11}
        />
      </View>
    </View>
  );
};

const RankingAgent = ({numberPropertySell}) => {
  // const rankInfo = MAP_RANK[rankName];
  return (
    <>
      {/* <View style={styles.containRank}>
        <Text style={{...FONTS.regular}} numberOfLines={2}>
          Hạng đối tác:
        </Text>
        <Image style={styles.iamgeRank} source={IMAGES[rankInfo.icon]} />
        <Text numberOfLines={2} style={[styles.ranking, {color: COLORS[rankInfo.color]}]}>
          {rankAgent}
        </Text>
      </View> */}
      <Text numberOfLines={2} style={styles.numberPropertySell}>
        Số lượng bất động sản giao dịch:{' '}
        <Text style={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}> {numberPropertySell}</Text>
      </Text>
    </>
  );
};

const PropertyType = ({propertyInterested}) => {
  return (
    <>
      <Text numberOfLines={2} style={styles.titleArea}>
        Loại bất động sản quan tâm:
      </Text>
      <View style={styles.containerProperty}>
        {propertyInterested.map((item, index) => (
          <View key={index} style={styles.viewRank}>
            <Image
              source={MAP_PROPERTY[item.name].icon}
              style={styles.propertyTypeIcon}
              resizeMode="contain"
            />
            <Text style={styles.itemType}>{MAP_PROPERTY[item.name].name}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const InterestedArea = ({areaInterested}) => {
  return (
    <>
      <Text numberOfLines={2} style={[styles.titleArea, styles.bottomList]}>
        Khu vực quan tâm:
      </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEventThrottle={15}
        contentContainerStyle={styles.scrollViewArea}>
        {areaInterested.map((item, index) => (
          <View key={index} style={styles.itemArea}>
            <Text style={{color: COLORS.TEXT_DARK_10, ...FONTS.regular}}>
              {`${item.districtName} - ${item.cityName}`}
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const AgentItem = props => {
  const {agentInfo, onPress, customStyle} = props;
  return (
    <View style={[styles.containerItem, customStyle]}>
      <View style={{padding: normal}}>
        <TouchableOpacity onPress={() => onPress(agentInfo.agentId)} activeOpacity={0.6}>
          <AgentInfo
            group={agentInfo.groupName}
            avatar={agentInfo.avatarAgent}
            name={agentInfo.nameAgent}
            rateNumber={agentInfo.rateNumber}
          />
          <RankingAgent
            rankName={agentInfo.rankName}
            rankAgent={agentInfo.rankAgent}
            numberPropertySell={agentInfo.numberPropertySell}
          />
          <PropertyType propertyInterested={agentInfo.propertyInterested} />
        </TouchableOpacity>
      </View>
      <InterestedArea areaInterested={agentInfo.areaInterested} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewInvestor: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  avatarViewer: {
    width: ICON_MEMBER_SIZE + 2,
    height: ICON_MEMBER_SIZE + 2,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    marginHorizontal: 5,
    borderRadius: 27,
  },
  textOwnerName: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  containerItem: {
    shadowColor: COLORS.TEXT_DARK_10,
    width: fullSize.width,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    alignSelf: 'center',
    marginTop: 10,
    ...commonStyles.shadowApp,
  },
  itemArea: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: COLORS.GREY_E4,
    borderRadius: SIZES.BORDER_RADIUS_20,
    marginBottom: 12,
    marginLeft: 12,
  },
  scrollViewArea: {marginTop: 12, paddingRight: 12},
  titleArea: {...FONTS.regular, fontSize: 14, color: COLORS.GREY_A7},
  itemType: {flex: 1, marginLeft: 5, ...FONTS.regular, fontSize: 14},
  nameAgent: {alignItems: 'flex-start', marginLeft: 12, overflow: 'hidden', flexShrink: 1},
  // agentTitle: {...FONTS.regular, marginBottom: 5, fontSize: 12, color: COLORS.GREY_A7},
  numberPropertySell: {...FONTS.regular, fontSize: 14, color: COLORS.GREY_A7, marginVertical: 12},
  // ranking: {...FONTS.bold, fontSize: 15, color: COLORS.GREY_A7},
  // iamgeRank: {marginHorizontal: 5, width: 20, height: 20},
  // containRank: {flexDirection: 'row', alignItems: 'center', marginTop: 16},
  viewRank: {
    flexDirection: 'row',
    width: SCREEN_SIZE.WIDTH / 2 - 40,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyTypeIcon: {width: 24, height: 24},
  containerProperty: {
    width: null,
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomList: {marginLeft: 12},
});

AgentItem.propTypes = {
  agentInfo: PropTypes.object.isRequired,
  style: ViewPropTypes.style,
};

AgentItem.defaultProps = defaultAgent;

export default AgentItem;
