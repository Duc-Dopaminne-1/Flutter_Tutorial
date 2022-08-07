import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';

function SpaceView() {
  return <View style={styles.container} />;
}

export default memo(SpaceView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 0.7,
    backgroundColor: colors.separator_line,
  },
});
