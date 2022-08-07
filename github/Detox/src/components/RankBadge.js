import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View, ViewPropTypes} from 'react-native';

import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {normal, small} from '../assets/theme/metric';

const styles = StyleSheet.create({
  containerRank: {
    ...HELPERS.center,
    borderRadius: 16,
    paddingHorizontal: normal,
    paddingVertical: small,
    marginVertical: small,
    minWidth: 119,
  },
  textRank: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.NEUTRAL_WHITE,
  },
});

const RankBadge = ({rank, style, title, isAgent = true, textStyle}) => {
  const {agentRankingName, hexColorCode} = rank;
  const rankColor = hexColorCode ? hexColorCode : COLORS.TEXT_DARK_40;
  const text = isAgent ? `${agentRankingName}` : title;
  return (
    <View style={[styles.containerRank, {backgroundColor: rankColor}, style]}>
      <Text style={[styles.textRank, textStyle]}>{text}</Text>
    </View>
  );
};

RankBadge.propTypes = {
  rank: PropTypes.exact({
    agentRankingName: PropTypes.string.isRequired,
    hexColorCode: PropTypes.string,
  }).isRequired,
  style: ViewPropTypes.style,
};

RankBadge.defaultProps = {
  rank: {agentRankingName: ''},
  style: {},
  textStyle: {},
};

export default RankBadge;
