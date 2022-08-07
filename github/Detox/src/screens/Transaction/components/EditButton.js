import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {METRICS} from '../../../assets/theme/metric';

const styles = StyleSheet.create({
  icon: {
    width: 21,
    height: 21,
  },
});

const EditButton = ({style, onPress}) => {
  return (
    <TouchableOpacity style={[METRICS.marginStart, style]} onPress={onPress}>
      <Image source={IMAGES.IC_EDIT_WITH_GRID} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

export default EditButton;
