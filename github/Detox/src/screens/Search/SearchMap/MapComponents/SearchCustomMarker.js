import React, {memo, useEffect, useState} from 'react';
import {Marker} from 'react-native-maps';

import {callAfterInteraction} from '../../../commonHooks';
import {SEARCH_TYPE} from './MapHelpers';
import {MarkerViewWithAvatar, MarkerViewWithText} from './MarkerViews';

const getMarkerView = ({item, labelMaker, searchType, isSelected, onLoaded, isOnRentalTab}) => {
  switch (searchType) {
    case SEARCH_TYPE.PROPERTY_POSTS:
      const price = isOnRentalTab ? item.rentPrice : item.price;
      return (
        <MarkerViewWithText //format
          text={`${price} - ${item?.buildingArea} m2`}
          onLoaded={onLoaded}
          isSelected={isSelected}
        />
      );
    case SEARCH_TYPE.PROJECTS:
      return (
        <MarkerViewWithText text={item?.projectName} onLoaded={onLoaded} isSelected={isSelected} />
      );
    case SEARCH_TYPE.AGENTS:
      return (
        <MarkerViewWithAvatar url={item.avatarAgent} onLoaded={onLoaded} isSelected={isSelected} />
      );
    case SEARCH_TYPE.SPIDERS:
      return <MarkerViewWithText text={labelMaker} onLoaded={onLoaded} isSelected={isSelected} />;
    default:
      return null;
  }
};

const SearchCustomMarker = memo(
  ({
    coordinate,
    item,
    onPressMarker,
    searchType,
    isSelected,
    isOnRentalTab,
    labelMaker,
    ...otherProps
  }) => {
    const [trackChanges, setTrackChanges] = useState(true);
    const [onLoadEnd, setOnLoadEnd] = useState(false);

    const onLoaded = () => {
      callAfterInteraction(() => {
        setTrackChanges(false);
      });
      setOnLoadEnd(true);
    };

    useEffect(() => {
      if (!onLoadEnd) {
        return;
      }
      setTrackChanges(true);
      callAfterInteraction(() => {
        setTrackChanges(false);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelected]);

    const onPress = () => {
      onPressMarker(item);
    };

    return (
      <Marker
        tracksViewChanges={trackChanges}
        onPress={onPress}
        coordinate={{latitude: coordinate.latitude, longitude: coordinate.longitude}}
        {...otherProps}>
        {getMarkerView({item, labelMaker, searchType, isSelected, onLoaded, isOnRentalTab})}
      </Marker>
    );
  },
);

export default SearchCustomMarker;
