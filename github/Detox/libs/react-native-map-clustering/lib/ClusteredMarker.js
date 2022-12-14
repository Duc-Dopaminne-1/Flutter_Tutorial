import React, {memo} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Marker} from 'react-native-maps';
import {returnMarkerStyle} from './helpers';
import {FONTS} from '../../../src/assets/theme/fonts';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    opacity: 0.5,
    zIndex: 0,
  },
  cluster: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    ...FONTS.semiBold,
  },
});

const ClusteredMarker = ({
  geometry,
  properties,
  onPress,
  clusterColor,
  clusterTextColor,
  tracksClusterViewChanges,
}) => {
  const points = properties.point_count;
  const {width, height, fontSize, size} = returnMarkerStyle(points);

  return (
    <Marker
      coordinate={{
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
      }}
      tracksViewChanges={tracksClusterViewChanges}
      style={{zIndex: points + 1}}
      onPress={onPress}>
      <TouchableOpacity activeOpacity={0.5} style={[styles.container, {width, height}]}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: clusterColor,
              width,
              height,
              borderRadius: width / 2,
            },
          ]}
        />
        <View
          style={[
            styles.cluster,
            {
              backgroundColor: clusterColor,
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}>
          <Text style={[styles.text, {color: clusterTextColor, fontSize}]}>{points}</Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

export default memo(ClusteredMarker);
