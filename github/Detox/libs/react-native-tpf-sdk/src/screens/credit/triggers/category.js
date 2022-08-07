import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import ProductsSection from './sections/products';
import { getFlowByTriggerCodeHandle } from '../../../redux/actions/masterData';

const PAGE_SIZE = 10;

const CategoryCreditScreen = props => {
  const dispatch = useDispatch();

  const creditCategoriesList = useSelector(state => state.masterData.categoryListFlow);
  const creditCategoriesTotalCount = useSelector(
    state => state.masterData.totalCountCategoryListFlow
  );
  const creditCategoriesLoading = useSelector(state => state.masterData.flowTriggerLoading);
  const triggerTarget = useSelector(state => state.masterData.trigger);

  /*useEffect(() => {
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget.triggerCode,
        maxResultCount: PAGE_SIZE,
        skipCount: 0
      })
    );
  }, [dispatch]);*/

  const renderCategorySection = useCallback(
    ({ item }) => <ProductsSection route={props.route} category={item} />,
    [props.route]
  );

  const loadMore = useCallback(() => {
    if (creditCategoriesTotalCount > creditCategoriesList.length && !creditCategoriesLoading) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode: triggerTarget.triggerCode,
          maxResultCount: PAGE_SIZE,
          skipCount: creditCategoriesList.length
        })
      );
    }
  }, [creditCategoriesTotalCount, creditCategoriesList, creditCategoriesLoading, dispatch]);

  const renderFooter = useCallback(
    () =>
      creditCategoriesLoading && creditCategoriesList?.length > 0 ? <ActivityIndicator /> : null,
    [creditCategoriesLoading, creditCategoriesList]
  );

  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget.triggerCode,
        maxResultCount: PAGE_SIZE,
        skipCount: 0
      })
    );
  }, [dispatch]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}
      data={creditCategoriesList || []}
      renderItem={renderCategorySection}
      onEndReached={loadMore}
      ListFooterComponent={renderFooter}
      keyExtractor={item => 'category' + item?.id}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

export default CategoryCreditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    paddingBottom: SPACING.HasBottomButton
  },
  productsSection: {
    marginTop: scale(24)
  }
});
