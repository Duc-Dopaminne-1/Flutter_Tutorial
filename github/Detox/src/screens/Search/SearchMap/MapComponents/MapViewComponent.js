import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, PixelRatio, Platform, ViewPropTypes} from 'react-native';
import MapView from 'react-native-map-clustering';
import {PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeArea} from 'react-native-safe-area-context';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {DEFAULT_COORDINATES, SEARCH_TYPE} from './MapHelpers';
import SearchCustomMarker from './SearchCustomMarker';

const INITIAL_REGION = {
  ...DEFAULT_COORDINATES,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

const CLUSTER_RADIUS = Dimensions.get('window').width * 0.04;

const generateMarkers = ({data, searchType, selectedMarkerId, onPressMarker, isOnRentalTab}) => {
  return data.map((item, index) => {
    const {latitude, longitude} = item;
    const coordinate = {latitude, longitude};
    return (
      <SearchCustomMarker
        key={index.toString()}
        coordinate={coordinate}
        item={item}
        onPressMarker={onPressMarker}
        searchType={searchType}
        isSelected={selectedMarkerId && selectedMarkerId === item.markerId}
        isOnRentalTab={isOnRentalTab}
      />
    );
  });
};

const MapViewComponent = ({
  style,
  data,
  searchType,
  onPressMarker,
  selectedMarkerId,
  isOnRentalTab,
  onPressSpiderMarker,
  ...otherMapViewProps
}) => {
  const mapRef = useRef(null);
  const insets = useSafeArea();
  const [mapReady, setMapReady] = useState(false);

  const fitMapToMarkers = coordinates => {
    const iosEdgePadding = {top: 120 + insets.top, bottom: 60 + insets.bottom, right: 30, left: 30};
    const androidEdgePadding = {
      top: PixelRatio.getPixelSizeForLayoutSize(iosEdgePadding.top),
      right: PixelRatio.getPixelSizeForLayoutSize(iosEdgePadding.right),
      bottom: PixelRatio.getPixelSizeForLayoutSize(iosEdgePadding.bottom),
      left: PixelRatio.getPixelSizeForLayoutSize(iosEdgePadding.left),
    };
    const edgePadding = Platform.OS === 'android' ? androidEdgePadding : iosEdgePadding;
    if (coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: edgePadding,
      });
    }
  };

  useEffect(() => {
    if (data && mapReady) {
      const coordinates = data.map(item => ({
        latitude: item.latitude,
        longitude: item.longitude,
      }));
      fitMapToMarkers(coordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mapReady]);

  const onMapReady = () => {
    setMapReady(true);
  };

  const allMarkers = useMemo(() => {
    return generateMarkers({
      data: data,
      searchType: searchType,
      selectedMarkerId,
      onPressMarker: onPressMarker,
      isOnRentalTab,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedMarkerId]);

  return data && data.length > 0 ? (
    <MapView
      mapRef={map => (mapRef.current = map)}
      onMapReady={onMapReady}
      style={style}
      showsUserLocation={true}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      clusterColor={COLORS.PRIMARY_A100}
      tracksClusterViewChanges={false}
      radius={CLUSTER_RADIUS}
      showsTraffic={false}
      showsBuildings={false}
      childSpiderMarkers={dataSpider => {
        return (
          <SearchCustomMarker
            coordinate={dataSpider[0]?.item?.properties?.coordinate}
            onPressMarker={() => {
              onPressSpiderMarker(dataSpider);
            }}
            searchType={SEARCH_TYPE.SPIDERS}
            labelMaker={`${dataSpider.length} ${translate(STRINGS.POST)}`}
            isSelected={selectedMarkerId === dataSpider[0]?.item?.properties?.item?.markerId}
          />
        );
      }}
      {...otherMapViewProps}>
      {allMarkers}
    </MapView>
  ) : (
    <MapView
      onMapReady={onMapReady}
      initialRegion={INITIAL_REGION}
      style={style}
      provider={PROVIDER_GOOGLE}
      {...otherMapViewProps}
    />
  );
};

MapViewComponent.propTypes = {
  style: ViewPropTypes.style,
  data: PropTypes.array,
  searchType: PropTypes.oneOf([
    SEARCH_TYPE.AGENTS,
    SEARCH_TYPE.PROJECTS,
    SEARCH_TYPE.PROPERTY_POSTS,
  ]),
  onPressMarker: PropTypes.func,
};

MapViewComponent.defaultProps = {
  data: [],
  searchType: SEARCH_TYPE.PROPERTY_POSTS,
  onPressMarker: () => {},
};

export default MapViewComponent;
