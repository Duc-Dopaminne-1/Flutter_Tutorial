import {findIndex, isEmpty} from 'lodash';
import React, {useRef} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  tab: {
    ...METRICS.marginEnd,
    ...HELPERS.center,
  },
  tabText: {
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 15,
  },
  indicatorContainer: {
    ...HELPERS.center,
    ...HELPERS.fullWidth,
    ...METRICS.smallMarginTop,
  },
  tabIndicatorSelected: {
    ...HELPERS.fullWidth,
    backgroundColor: COLORS.PRIMARY_A100,
    height: 3,
    minWidth: 64,
  },
  tabIndicator: {
    ...HELPERS.fullWidth,
    backgroundColor: COLORS.TRANSPARENT,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    height: 4,
    minWidth: 64,
  },
});

const renderItem = (item, isSelected, onPress = () => {}) => {
  const indicator = isSelected ? styles.tabIndicatorSelected : styles.tabIndicator;
  return (
    <TouchableOpacity style={styles.tab} onPress={() => onPress(item.blockName)}>
      <Text style={styles.tabText}>{item.blockName}</Text>
      <View style={styles.indicatorContainer}>
        <View style={indicator} />
      </View>
    </TouchableOpacity>
  );
};

const keyExtractor = (item, index) => `${index}`;

const BlockList = ({onTabChanged, items, currentIndex, setCurrentIndex}) => {
  const listRef = useRef(null);

  if (isEmpty(items)) {
    return null;
  }

  const onPressTab = item => {
    const index = findIndex(items, it => it.blockName === item);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onTabChanged && onTabChanged(item);
      listRef.current?.scrollToIndex({index}); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
    }
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        style={[METRICS.horizontalMargin]}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={items}
        renderItem={({item, index}) => renderItem(item, index === currentIndex, onPressTab)}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default BlockList;
