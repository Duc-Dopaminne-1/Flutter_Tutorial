import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {small, tiny} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.center,
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    ...FONTS.regular,
    fontSize: 12,
    marginTop: tiny,
  },
  count: {
    ...FONTS.regular,
    fontSize: 18,
  },
  viewColor: {width: 10, height: '100%', borderRadius: SIZES.BORDER_RADIUS_10},
});

const PropertyNumberInfo = ({title, tabColor = COLORS.CIRCLE_BACKGROUND, count = 0, focused}) => {
  const focusStyle = focused ? {color: tabColor, ...FONTS.bold} : {color: COLORS.TEXT_DARK_10};

  return (
    <View style={styles.container}>
      <View style={[styles.viewColor, {backgroundColor: tabColor}]} />
      <View style={{marginLeft: small}}>
        <Text style={[styles.title, focusStyle]}>{title}</Text>
        <Text style={[styles.count, focusStyle]}>{`${count}`}</Text>
      </View>
    </View>
  );
};

export default PropertyNumberInfo;
