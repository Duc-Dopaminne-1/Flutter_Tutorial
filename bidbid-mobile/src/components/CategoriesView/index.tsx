import { colors, fonts } from '@/vars';
import * as React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { CategoryItem } from '../CategoryItem';

export type Props = {
  categories: any[];
};

export function CategoriesView(Props: Props): React.ReactElement {
  const { categories = [] } = Props;

  if (!categories || categories.length < 1) return null;
  return (
    <View style={styles.container}>
      {categories.map(category => {
        return (
          <CategoryItem
            key={category.name || category}
            text={category.name || category}
            containerStyle={styles.categoryItemStyle}
            textStyle={styles.categoryText}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,

  categoryItemStyle: {
    backgroundColor: colors.blue_700,
  } as ViewStyle,

  categoryText: {
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s14,
  } as TextStyle,
});
