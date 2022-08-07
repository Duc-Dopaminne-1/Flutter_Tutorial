import React, { ReactElement, useEffect, useState, memo } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '@/models/';
import { setFilterCategories } from '@/redux/filters/actions';
import FilterCategoryItem from '@/screens/Filter/FilterCategoriesScreen/components/FilterCategoryItem';
import { language } from '@/i18n';

const CONTAINER: ViewStyle = {
  minHeight: 180,
  justifyContent: 'flex-end',
  backgroundColor: colors.gray_100,
  paddingLeft: 40,
  paddingRight: 15,
};

const TEXT_HEADER: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsRegular,
  fontWeight: fonts.fontWeight.bold,
  paddingTop: 10,
};

interface FilterCategoriesScreenProps {
  categoryList: Category[];
}

function FilterCategoriesScreen(props: FilterCategoriesScreenProps): ReactElement {
  const { categoryList } = props;
  const dispatch = useDispatch();

  const categories = useSelector((state: RootState) => state.filters.categories);

  const [categoriesSelected, setCategoriesSelected] = useState([]);

  useEffect(() => {
    setCategoriesSelected(categories);
  }, [categories]);

  const categoryOnPressed = async (item: Category) => {
    let newArray = [...categoriesSelected];
    if (checkIsSelected(item)) {
      newArray = categoriesSelected.filter(itemSelected => itemSelected.id !== item.id);
    } else {
      newArray.push(item);
    }
    setCategoriesSelected(newArray);

    if (newArray && newArray.length > 0) {
      const categories = newArray.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });

      dispatch(setFilterCategories(categories, {}));
    } else {
      dispatch(setFilterCategories([], {}));
    }
  };

  const checkIsSelected = (category: Category) => {
    let isSelected = false;
    categoriesSelected.map(item => {
      if (item.id === category.id) isSelected = true;
    });
    return isSelected;
  };

  return (
    <View style={CONTAINER}>
      <Text style={TEXT_HEADER}>{language('chooseCategories')}</Text>
      {categoryList.map(categoryItem => {
        return (
          <FilterCategoryItem
            key={categoryItem.id.toString()}
            category={categoryItem}
            listSelected={categoriesSelected}
            onPressed={categoryOnPressed}
          />
        );
      })}
    </View>
  );
}

export default memo(FilterCategoriesScreen);
