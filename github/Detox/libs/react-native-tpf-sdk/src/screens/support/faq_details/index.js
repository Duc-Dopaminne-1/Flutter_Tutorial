import React from 'react';
import styles from './styles';
import { ExpandView } from '../../../components/';
import { scale } from '../../../utils/responsive';
import { SPACING } from '../../../constants/size';
import { createSelector } from 'reselect';
import AppText from '../../../components/app_text';
import { LIMIT_PAGE } from '../../../global/app';
import CustomWebview from '../../../components/custom_webview';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getFAQDetailsListClear, getFAQDetailsListHandle } from '../../../redux/actions/faq';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import {
  faqDetaiLoadingSelector,
  faqDetailPageSelector,
  faqDetailsListSelector
} from '../../../redux/selectors/faq';

const listSelector = createSelector(faqDetailsListSelector, list => list);
const loadingSelector = createSelector(faqDetaiLoadingSelector, loading => loading);
const pageSelector = createSelector(faqDetailPageSelector, page => page);

const ItemList = ({ title = '', content = '' }) => {
  return (
    <View style={styles.contentWrapper}>
      <ExpandView translate title={title} expanded={false}>
        <View style={styles.content}>
          <CustomWebview
            {...{ content }}
            padding={SPACING.Medium * 2}
            parentPadding={SPACING.Medium * 2}
            style={{ paddingTop: 0, paddingBottom: 0 }}
          />
        </View>
      </ExpandView>
    </View>
  );
};

const FaqDetails = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const page = useSelector(pageSelector);
  const list = useSelector(listSelector);
  const loading = useSelector(loadingSelector);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const {
    item: { title, id }
  } = props.route.params;

  React.useEffect(() => {
    navigation.setOptions({ title, translate: false });
    dispatch(getFAQDetailsListHandle({ cmsCategoryId: id }));

    return () => {
      dispatch(getFAQDetailsListClear());
    };
  }, [dispatch, navigation]);

  React.useEffect(() => {
    if (page === 0) {
      setRefreshing(false);
      dispatch(getFAQDetailsListHandle({ cmsCategoryId: id }));
    }
  }, [page]);

  const loadMore = () => {
    if (loading === null) {
      return;
    }

    const skipCount = page * LIMIT_PAGE;
    dispatch(getFAQDetailsListHandle({ cmsCategoryId: id, SkipCount: skipCount }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getFAQDetailsListClear());
  };
  const renderItem = ({ item, index }) => {
    return <ItemList content={item.answer} title={item.question} />;
  };
  const keyExtractor = element => '' + element.id;

  return (
    <FlatList
      data={list ? list : []}
      renderItem={renderItem}
      onEndReached={loadMore}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.2}
      refreshing={isRefreshing}
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
      showsVerticalScrollIndicator={false}
      style={styles.financialProblemWrapper}
      contentContainerStyle={styles.listWrapper}
      ListEmptyComponent={
        list ? (
          <View style={{ paddingTop: scale(50), alignItems: 'center' }}>
            <AppText translate>{'additional_service_profiles.no_products'}</AppText>
          </View>
        ) : (
          <ActivityIndicator />
        )
      }
    />
  );
};

export default FaqDetails;
