import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';

const styles = StyleSheet.create({
  container: {flexDirection: 'row', minHeight: 44},
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  parentTitle: {
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
    fontSize: 12,
  },

  icon: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
const CustomNavigationLeftBackOnly = ({navigation, parentTitle}: {parentTitle: String}) => {
  const onBack = () => navigation.pop();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <View style={styles.left}>
          <Icon style={styles.icon} name="ios-arrow-back" size={30} color={COLORS.TEXT_DARK_40} />
          <Text style={styles.parentTitle}>{parentTitle}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomNavigationLeftBackOnly;
