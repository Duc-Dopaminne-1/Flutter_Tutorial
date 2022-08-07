import React, { ReactElement, memo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '@/vars';

function CustomLoading(): ReactElement {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" color={colors.red_600} />
    </View>
  );
}

export default memo(CustomLoading);

const styles = StyleSheet.create({
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.white,
    height: '100%',
    width: '100%',
  },
});
