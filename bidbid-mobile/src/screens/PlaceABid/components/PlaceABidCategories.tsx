import React, { ReactElement, useEffect, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { PlaceABidCategoryItem } from './PlaceABidCategoryItem';
import { Category } from '@/models/category';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories, setCategoriesPlaceABid } from '@/redux/placeABid/actions';
import sortCategories from '@/shared/sortCategories';

const CONTAINER: ViewStyle = {
  marginTop: 20,
  justifyContent: 'center',
  backgroundColor: colors.white,
  borderRadius: 20,
};

const TITLE: TextStyle = {
  paddingHorizontal: 20,
  fontSize: fonts.size.s16,
  fontWeight: fonts.fontWeight.bold,
  color: colors.gray_900,
  fontFamily: fonts.family.PoppinsRegular,
};

const LIST_CATEGORIES: ViewStyle = {
  marginTop: 5,
  paddingHorizontal: 5,
  backgroundColor: colors.white,
  borderRadius: 20,
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: 5,
};

export function PlaceABidCategories(): ReactElement {
  const dispatch = useDispatch();
  const { auction, categoriesIdSelectedPlaceABid } = useSelector((state: RootState) => {
    return state.placeABid;
  });

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const itemOnPressed = (item: Category, _: number) => {
    let newArray: number[] = [...categoriesIdSelectedPlaceABid];
    const itemId = item.id as number;
    newArray = [];
    newArray.push(itemId);

    dispatch(setCategories(newArray));
    dispatch(setCategoriesPlaceABid(newArray));
  };

  useEffect(() => {
    if (auction.hasOwnProperty('categories')) {
      setCategoriesList(sortCategories(auction?.categories || []));
    }
  }, [auction]);

  return (
    <View style={CONTAINER}>
      <Text style={TITLE}>{language('placeABid.categories')}</Text>
      <View style={LIST_CATEGORIES}>
        {categoriesList.map((item, index) => (
          <PlaceABidCategoryItem
            key={item.id}
            item={item}
            index={index}
            itemsSelected={categoriesIdSelectedPlaceABid}
            itemOnPressed={itemOnPressed}
          />
        ))}
      </View>
    </View>
  );
}
