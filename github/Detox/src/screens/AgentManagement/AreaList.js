import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    ...METRICS.horizontalMargin,
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: COLORS.UNPROCESS_BAR,
    borderRadius: 16,
    alignItems: 'center',
    marginEnd: normal,
    marginBottom: small,
    paddingHorizontal: normal,
    paddingVertical: tiny,
  },
  text: {
    ...FONTS.regular,
    fontSize: 13,
  },
});

const AreaItem = ({area}) => {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{area.name}</Text>
    </View>
  );
};

const AreaList = ({areaList}) => {
  return (
    <View style={styles.container}>
      {areaList.map(item => (
        <AreaItem key={item.id} area={item} />
      ))}
    </View>
  );
};

export default AreaList;
