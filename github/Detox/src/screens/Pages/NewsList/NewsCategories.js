import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingRight: SIZES.PADDING_16,
  },
  container: {
    marginBottom: 0,
    paddingHorizontal: SIZES.PADDING_16,
    paddingBottom: SIZES.PADDING_16,
  },
  item: {
    marginRight: 30,
    height: 25,
  },
  itemActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY_B100,
    height: 25,
  },
  text: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
  },
  textActive: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
  },
});

const NewsCategories = ({onSelectCategory, categories, selectedCategory}) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      horizontal
      style={styles.container}>
      {categories.map(cat => {
        const isActive = cat.id === selectedCategory.id;
        const itemStye = isActive ? [styles.item, styles.itemActive] : styles.item;
        const textStyle = isActive ? [styles.text, styles.textActive] : styles.text;
        return (
          <TouchableOpacity style={itemStye} key={cat.id} onPress={() => onSelectCategory(cat)}>
            <Text style={textStyle}>{cat.text}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

NewsCategories.propTypes = {
  categories: PropTypes.array,
  selectedCategory: PropTypes.object,
  onSelectCategory: PropTypes.func,
};

NewsCategories.defaultProps = {
  categories: [],
  selectedCategory: {},
  onSelectCategory: null,
};

export default NewsCategories;
