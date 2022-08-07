import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {small} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  circle: {
    ...HELPERS.center,
    borderRadius: 16,
    backgroundColor: COLORS.BLUE_56,
    paddingTop: 3,
  },
  yourItemText: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
    marginStart: small,
  },
});

const YourItemLabel = ({size = 8, iconSize = 12, isShowLabel = true, isAgentUser = true}) => {
  const circleStyle = {height: size, width: size};
  if (!isAgentUser) {
    return null;
  }
  return (
    <View style={HELPERS.rowCenter}>
      <View style={[styles.circle, circleStyle]}>
        <Icon name="tie" size={iconSize} color={COLORS.NEUTRAL_WHITE} />
      </View>
      {isShowLabel && <Text style={styles.yourItemText}>{translate(STRINGS.YOUR_ITEM)}</Text>}
    </View>
  );
};

export default YourItemLabel;
