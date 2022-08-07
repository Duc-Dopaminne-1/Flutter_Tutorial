import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const PriceSuggestionsKeyboardScroll = ({data, onSelect = () => {}}) => {
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always" horizontal style={styles.scrollContainer}>
        {data.map((item, index) => (
          <TouchableOpacity onPress={() => onSelect(item)} key={index} style={styles.button}>
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: 50},
  scrollContainer: {
    height: 50,
    backgroundColor: COLORS.TEXT_GRAY_80,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  button: {
    marginEnd: 12,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: SIZES.BORDER_RADIUS_20,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {...FONTS.regular, fontSize: 12},
});

PriceSuggestionsKeyboardScroll.defaultProps = {
  onSelect: () => {},
  data: [],
};

export default PriceSuggestionsKeyboardScroll;
