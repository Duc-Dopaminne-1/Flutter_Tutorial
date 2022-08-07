import { useNavigation } from '@react-navigation/native';
import { ShowAllTitle } from '../../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import React, { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import InsuranceProduct from '../../../../screens/insurance/components/product';
import { scale } from '../../../../utils/responsive';
import { getInsuranceByCategoryHandle } from '../../../../redux/actions/insurance';
import { useEffect } from 'react';
import { handleTouchItem } from '../../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../../constants/screens';
import { handleTouch } from '../../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../../constants/analyticEnums';
import themeContext from '../../../../constants/theme/themeContext';

const ProductsSection = props => {
  const theme = useContext(themeContext);
  const { style, category, route } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector(state => state.insurance.insuranceProduct['' + category?.id || []]);
  const { topenId } = useSelector(state => state.auth);
  useEffect(() => {
    dispatch(
      getInsuranceByCategoryHandle({
        categoryId: category?.id,
        skipCount: 0,
        maxResultCount: 5
      })
    );
  }, [dispatch, category]);

  const onShowAll = useCallback(
    event => {
      handleTouch(event, 'SHOW_ALL', props.route, topenId, EVENT_TYPE.SHOW_ALL);
      navigation.navigate(SCREENS_NAME.ALL_INSURANCE_LIST_SCREEN, {
        category: category
      });
    },
    [props.route, topenId, navigation, category]
  );

  const onPress = useCallback(
    (event, item) => {
      handleTouchItem(
        event,
        'InsuranceItem',
        route,
        { ...item, categoryId: category?.id },
        topenId
      );
      navigation.navigate(SCREENS_NAME.INSURANCE_DETAIL_SCREEN, { item });
    },
    [route, category?.id, topenId, navigation]
  );

  const renderProductItem = useCallback(
    ({ item }) => (
      <InsuranceProduct
        key={'HighlightInsurance' + item.id}
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
        titleStyle={{ color: theme.text.primary }}
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
