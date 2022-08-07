import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';

const codes = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

const SIZE = 64;

const DTMF = ({onPress}) => {
  return (
    <View style={styles.container}>
      {codes.map((rows, index) => {
        return (
          <View key={index.toString()} style={styles.row}>
            {rows.map(value => {
              return (
                <TouchableOpacity
                  key={value}
                  style={styles.itemView}
                  onPress={() => onPress(value)}>
                  <Text style={styles.itemText}>{value}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
      <Text />
    </View>
  );
};

export default DTMF;

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  itemView: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  itemText: {
    ...FONTS.bold,
    fontSize: 24,
  },
});
