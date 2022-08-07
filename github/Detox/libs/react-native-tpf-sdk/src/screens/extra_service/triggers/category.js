import { useNavigation } from '@react-navigation/native';
import {
  clearLeadContactForExtraService,
  getExtraServiceListHandle
} from '../../../redux/actions/extraService';
import { EmptyContent } from '../../../components/';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../component/product_card';
import { empty_box } from '../../../assets/images';
import { getFlowByTriggerCodeHandle } from '../../../redux/actions/masterData';
import ExtraServiceDetail from '../../extra_service/detail';

const PAGE_SIZE = 10;

const ExtraServiceList = props => {
  const { changeTab, fromCreateLead } = props;
  const totalCount = useSelector(state => state.masterData.totalCountCategoryListFlow);
  const list = useSelector(state => state.masterData.categoryListFlow);
  const loading = useSelector(state => state.masterData.flowTriggerLoading);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const triggerTarget = useSelector(state => state.masterData.trigger);

  /*useEffect(() => {
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget?.triggerCode,
        maxResultCount: PAGE_SIZE,
        skipCount: 0
      })
    );
    return () => {};
  }, [dispatch]);*/

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.goBack();
      }
    });
  }, [navigation, dispatch]);

  useEffect(() => {
    if (!loading && isRefreshing) {
      setRefreshing(false);
    }
  }, [loading, isRefreshing]);

  const loadMore = () => {
    if (!loading && totalCount > list?.length) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode: triggerTarget.triggerCode,
          maxResultCount: PAGE_SIZE,
          skipCount: list?.length
        })
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode: triggerTarget.triggerCode,
        maxResultCount: PAGE_SIZE,
        skipCount: 0
      })
    );
  };

  const keyExtractor = (item, index) => index + '';
  const ListFooterComponent = () => (loading && list?.length > 10 ? <ActivityIndicator /> : null);

  const renderItem = ({ item }) => {
    return <ProductCard item={item} route={props.route} />;
  };

  if (totalCount > 1) {
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
  } else {
    let item = Array.isArray(list) && list.length > 0 ? list[0] : [];
    return (
      <ExtraServiceDetail
        fromCreateLead={fromCreateLead}
        fromTriggerFlow={true}
        changeTab={changeTab}
        //route={{ params: { item: { id: item.id } } }}
        data={item}
      />
    );
  }
};

export default ExtraServiceList;

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
