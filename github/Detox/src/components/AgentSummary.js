import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View, ViewPropTypes} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {normal, small, tiny} from '../assets/theme/metric';
import {getAgentRankColor} from '../utils/DataProcessUtil';
import JsonDataUtils from '../utils/JsonDataUtils';
import {getInterestedAreaString, getUserFullName} from '../utils/UserAgentUtil';
import Avatar from './Avatar';
import CustomIconButton from './CustomIconButton';
import RankBadge from './RankBadge';
import RatingComponent from './RatingComponent';
import TouchableView from './TouchableView';

const AVATAR_SIZE = 90;

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normal,
  },
  columnNameRank: {
    marginHorizontal: normal,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  nameStyle: {
    fontSize: 16,
    ...FONTS.bold,
  },
  rankBadge: {
    paddingVertical: tiny,
    paddingHorizontal: small,
    minWidth: 100,
  },
  textRank: {
    fontSize: 12,
  },
  devider: {
    marginHorizontal: normal,
    height: 1,
    backgroundColor: COLORS.SELECTED_AREA,
    marginTop: normal,
  },
  viewText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  buttonPhone: {
    width: 35,
    height: 35,
  },
  textTitle: {
    ...FONTS.bold,
    fontSize: 14,
  },
  textContent: {
    ...FONTS.regular,
    fontSize: 14,
  },
  viewAvatarAndName: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    flexShrink: 1,
  },
});

const TextRow = ({title, content}) => {
  return (
    <View style={styles.viewText}>
      <Text style={styles.textTitle}>{title + ': '}</Text>
      <Text style={styles.textContent}>{content}</Text>
    </View>
  );
};

const initialData = {
  name: '',
  textSpecialize: '',
  textAreas: '',
};

const mapAgentInfoToData = agentInfo => {
  if (!agentInfo) {
    return initialData;
  }
  const rankColor = getAgentRankColor(agentInfo?.agentRankName);
  const name = getUserFullName(agentInfo);
  const rank = {
    agentRankingName: agentInfo.agentRankingDescription,
    hexColorCode: rankColor,
  };
  let textSpecialize = ' ';
  const preferPropertyTypes = JsonDataUtils.parseJSONArray(agentInfo.preferPropertyTypes);
  for (let index = 0; index < preferPropertyTypes.length; index++) {
    const propertyType = preferPropertyTypes[index].description;
    if (index === 0) {
      textSpecialize += propertyType;
    } else {
      textSpecialize += ', ' + propertyType;
    }
  }
  let textAreas = '';
  const workingAreas = JSON.parse(agentInfo.workingAreas ?? CONSTANTS.DEFAULT_JSON_PARSE_ARRAY);
  for (let index = 0; index < workingAreas.length; index++) {
    const area = getInterestedAreaString({
      district: workingAreas[index].districtName,
      city: workingAreas[index].cityName,
    });
    if (index === 0) {
      textAreas += area;
    } else {
      textAreas += '; ' + area;
    }
  }
  return {
    profilePhoto: agentInfo.profilePhoto,
    rating: agentInfo.rating,
    name,
    rank,
    textSpecialize,
    textAreas,
  };
};

const AgentSummary = ({style, agentInfo, onPressTitleImage, onPressPhoneCall}) => {
  const data = mapAgentInfoToData(agentInfo);

  return (
    <View style={style}>
      <View style={styles.bannerContainer}>
        <View style={styles.viewAvatarAndName}>
          <TouchableView onPress={onPressTitleImage}>
            <Avatar size={AVATAR_SIZE} url={data.profilePhoto} />
          </TouchableView>
          <View style={styles.columnNameRank}>
            <TouchableView onPress={onPressTitleImage}>
              <Text style={styles.nameStyle}>{data.name}</Text>
            </TouchableView>
            <RankBadge rank={data.rank} textStyle={styles.textRank} style={styles.rankBadge} />
            <RatingComponent rateNumber={data.rating} backgroundColor={COLORS.BACKGROUND} />
          </View>
        </View>
        <CustomIconButton
          style={styles.buttonPhone}
          image={IMAGES.IC_PHONE}
          onPress={() => onPressPhoneCall(agentInfo.phoneNumber)}
        />
      </View>
      <View style={styles.devider} />
      <TextRow title={translate(STRINGS.SPECIALIZE)} content={data.textSpecialize} />
      <TextRow title={translate(STRINGS.AREA)} content={data.textAreas} />
      <View style={styles.devider} />
    </View>
  );
};

AgentSummary.propTypes = {
  style: ViewPropTypes.style,
  agentInfo: PropTypes.object,
  onPressTitleImage: PropTypes.func,
  onPressPhoneCall: PropTypes.func,
};

AgentSummary.defaultProps = {
  agentInfo: null,
  onPressTitleImage: null,
  onPressPhoneCall: () => {},
};

export default AgentSummary;
