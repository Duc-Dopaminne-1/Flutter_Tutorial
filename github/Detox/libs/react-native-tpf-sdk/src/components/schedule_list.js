import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ScheduleItem from '../screens/schedule/components/schedule_item';
import Divider from '../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import AppText from './app_text';

const ScheduleList = props => {
  const {
    data,
    checkBoxVisible,
    deleteItems = [],
    onSelectItem,
    onPressItem,
    loading,
    onRefresh,
    isRefreshing,
    loadMore
  } = props;

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <>
          <ScheduleItem
            item={item}
            checkBoxVisible={checkBoxVisible}
            deleteItems={deleteItems}
            onSelectItem={onSelectItem}
            onPressItem={onPressItem}
          />
          <Divider />
          <View style={{ height: SPACING.Medium }} />
        </>
      );
    },
    [checkBoxVisible, deleteItems, onSelectItem, onPressItem]
  );

  const keyExtractor = useCallback((item, index) => (item?.id || index).toString(), []);
  const ListFooterComponent = useCallback(
    () => (loading && !data ? <ActivityIndicator /> : null),
    [loading, data]
  );
  const ListEmptyComponent = useCallback(
    () =>
      data.length !== 0 ? (
        loading ? (
          <ActivityIndicator />
        ) : null
      ) : loading ? (
        <ActivityIndicator />
      ) : (
        <AppText translate style={styles.noData} bold>
          {'common.noData'}
        </AppText>
      ),
    [data, loading]
  );
  return (
    <FlatList
      data={data || []}
      renderItem={renderItem}
      contentContainerStyle={styles.wrapper}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor}
      onEndReached={loadMore}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
    />
  );
};

export default React.memo(ScheduleList);

export const styles = StyleSheet.create({
  wrapper: {
    paddingTop: SPACING.Large,
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    color: TEXT_COLOR.Gray,
    fontSize: FONT_SIZE.BodyText,
    marginTop: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
