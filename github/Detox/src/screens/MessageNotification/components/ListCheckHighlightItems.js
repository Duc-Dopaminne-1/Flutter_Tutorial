import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import CheckHighlightItem from './CheckHighlightItem';

const ListCheckHighlightItems = ({data, currentItem, onSelect}) => {
  const onSelectItem = item => {
    onSelect && onSelect(item);
  };

  return (
    <View style={styles.container}>
      {data.map(item => {
        const checked = item.id === currentItem.id;
        return (
          <CheckHighlightItem
            key={item.id}
            checked={checked}
            title={item.title}
            onPress={() => onSelectItem(item)}
            style={styles.item}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {marginBottom: SIZES.MARGIN_8, marginRight: SIZES.MARGIN_8},
});

export default React.memo(ListCheckHighlightItems);
