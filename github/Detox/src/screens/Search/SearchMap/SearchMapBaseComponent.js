import React, {useEffect, useState} from 'react';
import {Keyboard, LayoutAnimation, StyleSheet, View} from 'react-native';

import {DEFAULT_COORDINATES, SEARCH_TYPE, searchMapStyles} from './MapComponents/MapHelpers';
import MapViewComponent from './MapComponents/MapViewComponent';

const SearchMapBaseComponent = ({data, searchType, renderPopupItem, isOnRentalTab}) => {
  const [currentData, setCurrentData] = useState(null);
  const [listData, setListData] = useState([]);
  const onPressMarker = item => {
    changeCurrentData(item);
  };
  const onPressSpiderMarker = dataSpider => {
    const mapperItem = dataSpider.map(item => {
      return item.item.properties.item;
    });
    changeCurrentData(mapperItem);
  };

  const onPressMap = event => {
    Keyboard.dismiss();
    if (event.nativeEvent.action !== 'marker-press') {
      changeCurrentData(null);
    }
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      const newList = [];
      for (const index in data) {
        const item = isOnRentalTab
          ? {...data[index], ...data[index].searchPropertyPostInfoDto}
          : data[index];
        if ((item.latitude && item.longitude) || searchType === SEARCH_TYPE.AGENTS) {
          newList.push({
            ...item,
            latitude: item.latitude ?? DEFAULT_COORDINATES.latitude,
            longitude: item.longitude ?? DEFAULT_COORDINATES.longitude,
            markerId: index.toString(),
          });
        }
      }
      setListData(newList);
      changeCurrentData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const changeCurrentData = items => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentData(items);
  };

  const onRegionChangeComplete = () => {
    //Track when region change complete
  };

  return (
    <>
      <MapViewComponent
        data={listData}
        style={searchMapStyles.mapView}
        searchType={searchType}
        onPressMarker={onPressMarker}
        onPressSpiderMarker={onPressSpiderMarker}
        onPress={onPressMap}
        onRegionChangeComplete={onRegionChangeComplete}
        moveOnMarkerPress={false}
        selectedMarkerId={currentData?.length ? currentData[0].markerId : currentData?.markerId}
        isOnRentalTab={isOnRentalTab}
      />
      <View style={styles.wrapperPopup}>{currentData && renderPopupItem(currentData)}</View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapperPopup: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default SearchMapBaseComponent;
