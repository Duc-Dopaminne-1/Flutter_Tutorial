import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View, ViewPropTypes} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {MAP} from '../assets/constants';
import {IMAGES} from '../assets/images';
import {useMount} from '../screens/commonHooks';
import logService from '../service/logService';

const MARKER_SIZE_HEIGHT = 41;
const MARKER_SIZE_WIDTH = 26;

const styles = StyleSheet.create({
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -(MARKER_SIZE_WIDTH / 2),
    marginTop: -MARKER_SIZE_HEIGHT,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: MARKER_SIZE_HEIGHT,
    width: MARKER_SIZE_WIDTH,
  },
});

const initialMapDelta = {
  latitudeDelta: MAP.DEFAULT_LATITUDE_DELTA,
  longitudeDelta: MAP.DEFAULT_LONGITUDE_DELTA,
};

const MapSection = ({
  style,
  regionState,
  onPressMap,
  onMapMoveComplete,
  isMarkerFixed,
  iconSource,
  firstMapDelta,
  ...otherMapViewProps
}) => {
  const mapRef = useRef(null);
  const [mapDelta, setMapDelta] = useState(firstMapDelta);
  const [markerWidth, setMarkerWidth] = useState(0);
  const [markerHeight, serMarkerHeight] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  const onPress = event => {
    logService.log('on press map: ', event);
    onPressMap(event);
  };

  useMount(() => {
    const height = Image.resolveAssetSource(iconSource).height;
    const width = Image.resolveAssetSource(iconSource).width;
    setMarkerWidth(width);
    serMarkerHeight(height);
  });

  useEffect(() => {
    if (!regionState || !mapReady) {
      return;
    }
    mapRef.current.animateToRegion({...mapDelta, ...regionState});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionState, mapReady]);

  const onRegionChangeComplete = region => {
    setMapDelta({latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta});
    onMapMoveComplete(region);
  };

  return (
    <View style={style}>
      <MapView
        onMapReady={() => setMapReady(true)}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        minZoomLevel={MAP.MIN_ZOOM_LEVEL}
        initialRegion={{
          ...mapDelta,
          ...regionState,
        }}
        onPress={onPress}
        onRegionChangeComplete={onRegionChangeComplete}
        {...otherMapViewProps}>
        {!isMarkerFixed && (
          <Marker
            coordinate={{
              latitude: regionState.latitude,
              longitude: regionState.longitude,
            }}
          />
        )}
      </MapView>
      {isMarkerFixed && (
        <View
          style={[styles.markerFixed, {marginLeft: -(markerWidth / 2), marginTop: -markerHeight}]}
          pointerEvents="none">
          <Image
            style={[styles.marker, {height: markerHeight, width: markerWidth}]}
            source={iconSource}
          />
        </View>
      )}
    </View>
  );
};

MapSection.propTypes = {
  style: ViewPropTypes.style,
  regionState: PropTypes.object,
  onPressMap: PropTypes.func,
  onMapMoveComplete: PropTypes.func,
  isMarkerFixed: PropTypes.bool,
  firstMapDelta: PropTypes.object,
};

MapSection.defaultProps = {
  style: {},
  regionState: {},
  onPressMap: () => {},
  onMapMoveComplete: () => {},
  isMarkerFixed: false,
  iconSource: IMAGES.IC_DEFAULT_MARKER,
  firstMapDelta: initialMapDelta,
};

export default MapSection;
