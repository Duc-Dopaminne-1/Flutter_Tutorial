import { useNavigation } from '@react-navigation/native';
import { ShowAllTitle } from '../../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive';
import { getCreditByCategoryHandle, setProductListFilter } from '../../../../redux/actions/credit';
import { useEffect } from 'react';
import { handleTouchItem } from '../../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../../constants/screens';
import { handleTouch } from '../../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../../constants/analyticEnums';
import CreditProduct from '../components/product';

const ProductsSection = props => {
  const { style, category, route } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector(state => state.credit.creditProduct['' + category?.id || []]);
  const { topenId } = useSelector(state => state.auth);
  useEffect(() => {
    dispatch(
      getCreditByCategoryHandle({
        categoryId: category?.id,
        skipCount: 0,
        maxResultCount: 5
      })
    );
  }, [dispatch, category]);

  const onShowAll = useCallback(
    event => {
      handleTouch(event, 'SHOW_ALL', props.route, topenId, EVENT_TYPE.SHOW_ALL);
      dispatch(setProductListFilter({ categoryId: category?.id }));
      navigation.navigate(SCREENS_NAME.CREDIT_SUGGESTED_SCREEN);
    },
    [props.route, topenId, navigation, category]
  );

  const onPress = useCallback(
    (event, item) => {
      handleTouchItem(event, 'CreditItem', route, { ...item, categoryId: category?.id }, topenId);
      navigation.navigate(SCREENS_NAME.CREDIT_PRODUCT_DETAIL_SCREEN, { item });
    },
    [route, category?.id, topenId, navigation]
  );

  const renderProductItem = useCallback(
    ({ item, index }) => (
      <CreditProduct
        key={'HighlightInsurance' + item.id}
        isHot={index < 3}
        item={item}
        style={styles.item}
        containerStyle={styles.itemContainer}
        onPress={onPress}
      />
    ),
    [onPress]
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return items?.length > 0 ? (
    <View style={[styles.container, style]}>
      <ShowAllTitle
        style={{ paddingHorizontal: SPACING.Medium }}
        title={category?.name}
        onShowAll={onShowAll}
        enableShowAll
      />

      <FlatList
        horizontal
        pagingEnabled
        snapToAlignment={'start'}
        snapToInterval={scale(252 + 12)}
        decelerationRate={'fast'}
        data={items?.slice(0, 5)}
        renderItem={renderProductItem}
        style={styles.productList}
        contentContainerStyle={styles.contentListContainer}
        ItemSeparatorComponent={renderSeparator}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  ) : null;
};

export default ProductsSection;

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.Medium
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.Small,
    color: TEXT_COLOR.Inactive
  },
  productList: {},
  contentListContainer: {
    paddingHorizontal: SPACING.Medium
  },
  separator: {
    width: scale(12)
  },
  itemContainer: {
    marginTop: SPACING.XNormal,
    marginBottom: SPACING.Normal
  }
});
