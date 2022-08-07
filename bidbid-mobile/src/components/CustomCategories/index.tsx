import React, { useEffect, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { isIOS } from '@/shared/devices';
import sortCategories from '@/shared/sortCategories';
import { s, vs } from '@/vars/scaling';
import { useLocalizeNameField } from '@/shared/processing';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';

interface Categories {
  id: number;
  name: string;
  order: number;
}

interface AuctionsWonItem {
  categories?: string[] | Categories[];
  oldBid?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function CustomCategories(props: AuctionsWonItem): JSX.Element {
  const { categories, oldBid, style, textStyle } = props;
  const [categoryList, setCategoryList] = useState([]);
  const localize = useLocalizeNameField();
  const categoriesList = useSelector((state: RootState) => state.filters.data.categoriesList);

  useEffect(() => {
    setCategoryList(sortCategories(categories));
  }, [categories]);

  const renderItem = item => {
    if (oldBid) {
      let isSelected = item.id === oldBid[0];
      if (!isSelected) {
        isSelected = item.name === oldBid[0];
      }

      return (
        <CustomButton
          key={item.name}
          wrapBtn={styles.wrapBtnDuration}
          containerStyle={[styles.wrapCtnBtnDurationLarge, isSelected && styles.wrapSelected]}
          textStyle={[styles.textBtnLarge, isSelected && styles.textSelected]}
          text={localize(item)}
        />
      );
    }
    const category = localize(categoriesList.find(i => i.name === item)) || item;
    return (
      <CustomButton
        key={item}
        wrapBtn={styles.wrapBtnDuration}
        containerStyle={styles.wrapCtnBtnDuration}
        textStyle={[styles.textBtn, textStyle]}
        text={category}
      />
    );
  };

  return <View style={[styles.container, style]}>{categoryList.map(renderItem)}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: vs(isIOS ? vs(4) : 0),
    flexDirection: 'row',
  },
  wrapBtnDuration: {
    flex: null,
  },
  wrapCtnBtnDuration: {
    minHeight: null,
    height: null,
    width: null,
    alignSelf: 'flex-start',
    paddingVertical: vs(2),
    borderRadius: 45,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    borderWidth: 1,
    paddingHorizontal: s(8),
    marginRight: s(6),
  },
  textBtn: {
    fontSize: fonts.size.s10,
    color: colors.gray_600,
    fontFamily: fonts.family.RobotoRegular,
    letterSpacing: 0,
    fontWeight: null,
  },
  wrapCtnBtnDurationLarge: {
    minHeight: null,
    height: null,
    width: null,
    paddingVertical: vs(4),
    borderRadius: 30,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    marginRight: s(10),
    borderWidth: 1,
    paddingHorizontal: s(10),
    marginTop: vs(8),
  },
  textBtnLarge: {
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.RobotoRegular,
    letterSpacing: 0,
    fontWeight: null,
  },
  wrapSelected: {
    backgroundColor: colors.blue_700,
    borderColor: colors.blue_700,
  },
  textSelected: {
    color: colors.white,
  },
});
