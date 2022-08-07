import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import HeaderHome from './HeaderHome';
import styles from './styles';

const SearchBox = ({
  onSearch,
  onPressHotline,
  containerStyle,
  searchPlaceHolder = translate(STRINGS.SEARCH_PROPERTY_PLACEHOLDER),
  visibleRight = true,
  style,
  showIcon = true,
}) => {
  return (
    <View style={[styles.searchComponent, style]}>
      <View style={[styles.searchContainer, containerStyle]}>
        <TouchableOpacity onPress={onSearch} activeOpacity={1} style={styles.textSearch}>
          <View style={styles.searchIcon}>
            {showIcon && (
              <Image source={IMAGES.IC_SEARCH} style={styles.iconSearch} resizeMode="contain" />
            )}
          </View>
          <Text style={styles.textSearch}>{searchPlaceHolder}</Text>
        </TouchableOpacity>
      </View>
      {!!visibleRight && <HeaderHome onPressHotline={onPressHotline} />}
    </View>
  );
};

export default SearchBox;
