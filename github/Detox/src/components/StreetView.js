import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import RNStreetView from 'react-native-streetview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  streetView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const StreetView = ({coordinate}) => {
  if (Platform.OS === 'android') {
    delete coordinate.radius;
  }
  return (
    <View style={styles.container}>
      <RNStreetView style={styles.streetView} allGesturesEnabled={true} coordinate={coordinate} />
    </View>
  );
};

export default StreetView;
