import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';

const AccessoryView = ({title = '', containerStyle, textStyle, onPress}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.accessoryContainer}>
        <Text style={[styles.accessoryText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.GREY_EA,
    alignItems: 'flex-end',
  },
  accessoryContainer: {paddingHorizontal: 14, paddingVertical: 10},
  accessoryText: {...FONTS.bold, fontSize: 17, color: COLORS.BLUE_BASIC},
});

export default AccessoryView;
