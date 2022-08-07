import { useNavigation } from '@react-navigation/native';
import { getLoanProductListHandle } from '../../../redux/actions/credit';
import { EmptyContent } from '../../../components/';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFlowByTriggerCodeClear,
  getFlowByTriggerCodeHandle
} from '../../../redux/actions/masterData';
import { empty_box } from '../../../assets/images';
import ProductCard from '../component/product_card';

const TriggerProductList = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const list = useSelector(state => state.masterData?.productListFlow);
  const totalCount = useSelector(state => state.masterData?.totalCountProductListFlow);
  const loading = useSelector(state => state.masterData?.flowTriggerLoading);
  const triggerTarget = useSelector(state => state.masterData.trigger);
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.goBack();
      }
    });
  }, []);

  useEffect(() => {
    //onRefresh();
    return () => {
      dispatch(getFlowByTriggerCodeClear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isRefreshing) {
      setRefreshing(false);
    }
  }, [loading, isRefreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget.triggerCode,
        skipCount: 0
      })
    );
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && list?.length < totalCount) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode: triggerTarget.triggerCode,
          skipCount: list.length
        })
      );
    }
  }, [dispatch, loading, list, totalCount]);

  const keyExtractor = (item, index) => index + '';
  const ListFooterComponent = () => (loading && list?.length > 10 ? <ActivityIndicator /> : null);

  const renderItem = ({ item }) => {
    return <ProductCard item={item} route={props.route} />;
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.wrapper}
      data={list || []}
      renderItem={renderItem}
      onEndReached={loadMore}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={
        <EmptyContent
          translate
          title={'additional_service_profiles.no_products'}
          loading={loading}
          image={empty_box}
        />
      }
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

export default TriggerProductList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.HtmlBottom,
    paddingHorizontal: SPACING.Medium
  }
});
