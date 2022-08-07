import React from 'react';
import {StyleProp, StyleSheet, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {HELPERS} from '../assets/theme/helpers';

export interface RadioButtonProps {
  style: StyleProp;
  selected: boolean;
}

export default function RadioButton(props: RadioButtonProps) {
  const {style, selected} = props;
  return (
    <View style={[HELPERS.center, styles.container, style]}>
      {selected && <View style={styles.inner} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderColor: COLORS.PRIMARY_A100,
  },
  inner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY_A100,
  },
});
