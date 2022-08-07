import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {commonStyles} from '../assets/theme/styles';

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    ...HELPERS.center,
    borderRadius: SIZES.BORDER_RADIUS_100,
    backgroundColor: COLORS.GREY_F2,
  },
  selectedItemContainer: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  itemTitle: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.TEXT_DARK_10,
  },
  selectedItemTitle: {
    color: COLORS.NEUTRAL_WHITE,
  },
});

const mapInitItemsToUi = (data, selectedItems) => {
  if (!data || !data?.length) {
    return [];
  }
  const copyItems = data.map(e => ({...e}));
  const copySelectedItems = selectedItems && selectedItems.map(e => ({...e}));
  let itemCount = 0;
  return copyItems?.map(e => {
    copySelectedItems?.forEach(({id: selectedItemId}) => {
      if (selectedItemId === e.id) {
        e.checked = true;
      }
    });
    return {
      id: e.id ?? itemCount++,
      name: e.name ?? e.description ?? '',
      checked: e.checked,
    };
  });
};

const mapItemsToUi = (data, selectedItem, isMultiSelect) => {
  if (!data || !data?.length) {
    return [];
  }
  const copyItems = data.map(e => ({...e}));
  return copyItems?.map(e => {
    if (!isMultiSelect) {
      e.checked = false;
    }
    if (e.id === selectedItem?.id) {
      e.checked = !e.checked;
    }
    return {
      id: e.id,
      name: e.name || e.description || '',
      checked: e.checked,
    };
  });
};

const HorizontalList = ({
  items,
  containerStyle,
  listContainerStyle,
  selectedItems,
  title,
  titleStyle,
  shouldUseParentsItemsState = false,
  showsHorizontalScrollIndicator = true,
  isMultiSelect = false,
  onSelectedItem = () => {},
}) => {
  const [state, setState] = useState({items: []});
  const onChangeItems = () => {
    if (!shouldUseParentsItemsState) {
      setState({
        items: mapInitItemsToUi(items, selectedItems) || [],
      });
    }
  };
  useEffect(onChangeItems, [items]);
  const parentDataList = mapInitItemsToUi(items, selectedItems) || [];
  const renderItem = ({item}) => {
    const selectedBackground = item.checked && styles.selectedItemContainer;
    const selectedItemTitle = item.checked && styles.selectedItemTitle;
    const onSelected = () => {
      if (isMultiSelect) {
        onSelectedItem(item, !item.checked);
      } else {
        onSelectedItem(item);
      }
      !shouldUseParentsItemsState &&
        setState({
          items: mapItemsToUi(state.items, item, isMultiSelect),
        });
    };
    return (
      <TouchableOpacity style={[styles.itemContainer, selectedBackground]} onPress={onSelected}>
        <Text style={[styles.itemTitle, selectedItemTitle]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={containerStyle}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={commonStyles.separatorRow8} />
      <FlatList
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        data={shouldUseParentsItemsState ? parentDataList : state.items}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={commonStyles.separatorColumn8} />}
        horizontal
        contentContainerStyle={listContainerStyle}
      />
    </View>
  );
};

export default HorizontalList;
