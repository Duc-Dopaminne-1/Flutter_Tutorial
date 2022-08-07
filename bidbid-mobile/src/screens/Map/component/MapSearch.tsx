import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import { colors, screenWidth } from '@/vars';
import { STATUSBAR_HEIGHT } from '@/components/SafeArea';
import { mapService } from '@/shared/Map';
import { language } from '@/i18n';
import SearchSVG from '@/components/SVG/SearchSVG';

const config = {
  key: Config.GOOGLE_MAP_API_KEY,
  language: 'en',
};

interface MapSearchProps {
  onPressSearch?: (data: any, details: any) => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  wrapInputStyle?: ViewStyle;
  placeholder?: string;
  textPreviousSearch?: string;
  isFromFilter?: boolean;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholderTextColor?: string;
}
export const MapSearch = (props: MapSearchProps) => {
  const {
    onPressSearch,
    containerStyle,
    inputStyle,
    wrapInputStyle,
    placeholder = language('search.default'),
    textPreviousSearch,
    isFromFilter,
    onFocus,
    onBlur,
    onChangeText,
    placeholderTextColor = colors.gray_500,
  } = props;
  const mapRef = useRef(null);

  useEffect(() => {
    if (textPreviousSearch) {
      mapRef.current?.setAddressText(textPreviousSearch);
    }
  }, []);

  const onPressInputSearch = (data: any, details: any) => {
    if (!onPressSearch) {
      return;
    }

    if (!isFromFilter) {
      onPressSearch(data, details);
      return;
    }
    let address = '';
    let { location } = details.geometry;
    const result = mapService.getOnlyCity([
      {
        address_components: details.address_components,
      },
    ]);

    if (result.hasOwnProperty('city')) {
      address = result.city + ', ';
    } else if (result.hasOwnProperty('state')) {
      address = result.state + ', ';
    }
    if (result.hasOwnProperty('country')) {
      address = address + result.country;
    }
    mapRef.current?.setAddressText(address);
    onPressSearch(location, address);
  };

  const renderLeftButton = () => {
    if (isFromFilter) {
      return (
        <View style={styles.wrapIconSearch}>
          <SearchSVG />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.wrapSearch, containerStyle]}>
      <GooglePlacesAutocomplete
        ref={mapRef}
        styles={{
          container: [styles.searchContainer, wrapInputStyle],
          textInput: [styles.searchTextInput, inputStyle],
          listView: styles.listView,
          row: styles.row,
        }}
        textInputProps={{ placeholderTextColor, onFocus, onBlur, onChangeText }}
        keyboardShouldPersistTaps={'handled'}
        placeholder={placeholder}
        onPress={onPressInputSearch}
        renderLeftButton={renderLeftButton}
        query={config}
        fetchDetails
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 20,
    flex: null,
    width: screenWidth - 40,
    backgroundColor: colors.white,
    zIndex: 999,
    borderRadius: 10,
    padding: 1,
    borderColor: colors.red_600,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  wrapIconSearch: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  searchTextInput: {
    zIndex: 999,
    marginBottom: 0,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  wrapSearch: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 40,
    zIndex: 999,
    backgroundColor: colors.transparent,
    alignSelf: 'center',
  },
  listView: {
    maxHeight: 150,
  },
  row: {
    backgroundColor: colors.transparent,
  },
});
