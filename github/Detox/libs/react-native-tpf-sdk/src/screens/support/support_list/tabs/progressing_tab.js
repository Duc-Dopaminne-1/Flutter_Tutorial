import {
  getProcessingListFAQSupportClear,
  getProcessingListFAQSupportHandle
} from '../../../../redux/actions/faq';
import { ICEmpty } from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import { BOTTOM_TAB_HEIGHT, SPACING } from '../../../../constants/size';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LIMIT_PAGE } from '../../../../global/app';
import { scale } from '../../../../utils/responsive';
import SupportItem from '../../components/support_item';

const ProgressingTab = props => {
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.memberId);
  const list = useSelector(state => state.faq.faqProcessingSupportList);
  const page = useSelector(state => state.faq.faqProcessingSupportListPage);
  const loading = useSelector(state => state.faq.faqProcessingSupportListLoading);
  const [isRefreshing, setRefreshing] = React.useState(false);

  const onFetch = useCallback(() => {
    dispatch(getProcessingListFAQSupportClear());
    dispatch(
      getProcessingListFAQSupportHandle({
        params: {
          MemberIdFilter: memberId
        }
      })
    );
  }, [dispatch, memberId]);

  const loadMore = useCallback(() => {
    if (loading === null) {
      return;
    }
    const skipCount = page * LIMIT_PAGE;
    dispatch(
      getProcessingListFAQSupportHandle({
        params: {
          MemberIdFilter: memberId,
          SkipCount: skipCount
        }
      })
    );
  }, [dispatch, loading, page, memberId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    onFetch();
  }, [onFetch]);

  useEffect(() => {
    onFetch();
  }, [onFetch]);

  useEffect(() => {
    if (page === 0 && isRefreshing) {
      setRefreshing(false);
    }
  }, [page, isRefreshing]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('CREATE_FAQ_REQUEST', () => {
      onRefresh();
    });

    return () => listener.remove();
  }, [onRefresh]);

  useEffect(() => {
    return () => dispatch(getProcessingListFAQSupportClear());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }) => <SupportItem route={props.route} item={item} navigation={props.navigation} />,
    [props.navigation, props.route]
  );
  const keyExtractor = useCallback((item, index) => (item?.id || index).toString(), []);

  const ListFooterComponent = useCallback(
    () => (loading && !list ? <ActivityIndicator /> : null),
    [loading, list]
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ICEmpty />
            <AppText translate bold={true} style={styles.noData}>
              {'common.noData'}
            </AppText>
          </View>
        )}
        ListFooterComponent={ListFooterComponent}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
};

export default React.memo(ProgressingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingBottom: BOTTOM_TAB_HEIGHT
  },
  emptyContainer: {
    paddingTop: scale(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Fit,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
