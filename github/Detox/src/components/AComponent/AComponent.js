import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AComponentProps} from './types';

export const AComponent = ({style}: AComponentProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text>AComponent</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
