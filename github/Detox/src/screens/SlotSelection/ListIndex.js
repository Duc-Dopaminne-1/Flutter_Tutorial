import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../../assets/constants';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {METRICS} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  number: {
    ...FONTS.semiBold,
    fontSize: 10,
    color: COLORS.BLACK_4F,
  },
});

const NumberButton = ({value, onPress}) => {
  const text = `${value}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      key={text}
      style={METRICS.marginBottom}
      hitSlop={CONSTANTS.HIT_SLOP}>
      <Text style={styles.number}>{text}</Text>
    </TouchableOpacity>
  );
};

const ListIndex = ({count = 0, onPressIndex}) => {
  if (count === 1) {
    return <View />;
  }

  const data = [...Array(count).keys()];

  const onPress = index => {
    onPressIndex && onPressIndex(index);
  };

  const renderItem = ({item}) => {
    return <NumberButton onPress={() => onPress(item + 1)} value={item + 1} />;
  };

  return <FlatList data={data} keyExtractor={item => `${item}`} renderItem={renderItem} />;
};

export default ListIndex;
