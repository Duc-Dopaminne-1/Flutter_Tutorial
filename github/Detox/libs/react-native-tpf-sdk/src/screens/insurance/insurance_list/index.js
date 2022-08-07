import { getInsuranceCategoriesHandle } from '../../../redux/actions/insurance';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import HighlightSection from './sections/hightlight';
import ProductsSection from './sections/products';

const PAGE_SIZE = 10;

const InsuranceListScreen = props => {
  const dispatch = useDispatch();

  const insuranceCategoriesList = useSelector(state => state.insurance.insuranceCategoriesList);
  const insuranceCategoriesTotalCount = useSelector(
    state => state.insurance.insuranceCategoriesTotalCount
  );
  const insuranceCategoriesLoading = useSelector(
    state => state.insurance.insuranceCategoriesLoading
  );

  useEffect(() => {
    dispatch(
      getInsuranceCategoriesHandle({
        maxResultCount: PAGE_SIZE,
        skipCount: 0
      })
    );
  }, [dispatch]);

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
        getInsuranceCategoriesHandle({
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
      getInsuranceCategoriesHandle({
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
      ListHeaderComponent={<HighlightSection route={props.route} style={styles.highlightSection} />}
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

export default InsuranceListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.White
  },
  wrapper: {
    paddingBottom: SPACING.HasBottomButton
  },
  highlightSection: {},
  productsSection: {
    marginTop: scale(24)
  }
});
