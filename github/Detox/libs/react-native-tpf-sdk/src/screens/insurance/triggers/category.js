import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import ProductsSection from './../insurance_list/sections/products';
import { getFlowByTriggerCodeHandle } from '../../../redux/actions/masterData';

const PAGE_SIZE = 4;

const CategoryInsuranceScreen = props => {
  const dispatch = useDispatch();

  const insuranceCategoriesList = useSelector(state => state.masterData.categoryListFlow);
  const insuranceCategoriesTotalCount = useSelector(
    state => state.masterData.totalCountCategoryListFlow
  );
  const insuranceCategoriesLoading = useSelector(state => state.masterData.flowTriggerLoading);
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
    if (
      insuranceCategoriesTotalCount > insuranceCategoriesList.length &&
      !insuranceCategoriesLoading
    ) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode: triggerTarget.triggerCode,
          maxResultCount: PAGE_SIZE,
          skipCount: insuranceCategoriesList.length
        })
      );
    }
  }, [
    insuranceCategoriesTotalCount,
    insuranceCategoriesList,
    insuranceCategoriesLoading,
    dispatch
  ]);

  const renderFooter = useCallback(
    () =>
      insuranceCategoriesLoading && insuranceCategoriesList?.length > 0 ? (
        <ActivityIndicator />
      ) : null,
    [insuranceCategoriesLoading, insuranceCategoriesList]
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
      data={insuranceCategoriesList || []}
      renderItem={renderCategorySection}
      onEndReached={loadMore}
      ListFooterComponent={renderFooter}
      keyExtractor={item => 'category' + item?.id}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

export default CategoryInsuranceScreen;

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
