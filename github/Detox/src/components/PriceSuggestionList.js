import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  viewRangeSelect: {height: 50},
  containerSelect: {
    flexWrap: 'wrap',
    marginTop: 12,
    height: 50,
  },
  touchSelect: {
    marginEnd: 12,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: SIZES.BORDER_RADIUS_20,
    backgroundColor: COLORS.SELECTED_AREA,
  },
  textSelect: isActive => ({
    ...FONTS.regular,
    fontSize: 12,
    color: isActive ? COLORS.NEUTRAL_WHITE : COLORS.TEXT_BLACK,
  }),
});

const PriceSuggestionList = ({data, onSelect = () => {}, styleIsActive, styleItem}) => {
  return (
    <View style={styles.viewRangeSelect}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.containerSelect}>
        {data.map((item, index) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            key={index}
            style={
              item?.isActive
                ? {...styles.touchSelect, ...styleItem, ...styleIsActive}
                : {...styles.touchSelect, ...styleItem}
            }>
            <Text style={styles.textSelect(item?.isActive)}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

PriceSuggestionList.defaultProps = {
  onSelect: () => {},
  data: [],
};

export default PriceSuggestionList;
