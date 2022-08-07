import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {parseGraphqlError} from '../api/graphql/parseGraphqlError.js';
import {translate} from '../assets/localize/index.js';
import {STRINGS} from '../assets/localize/string.js';
import {COLORS} from '../assets/theme/colors.js';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers.js';
import Section from './Section.js';

const styles = StyleSheet.create({
  emptyContainer: {
    ...HELPERS.center,
  },
  centerText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
});

const Message = ({message}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.centerText}>{message}</Text>
    </View>
  );
};

export const Loading = ({loading = false, children, SkeletonComponent}) => {
  if (loading) {
    if (SkeletonComponent) {
      return SkeletonComponent;
    }
    return <Message message={translate(STRINGS.LOADING)} />;
  }
  return children;
};

const DataContent = ({
  items,
  renderComponent,
  renderItem,
  keyExtractor,
  error,
  dataError,
  loading,
  getItemLayout,
  ItemSeparatorComponent,
  snapToInterval,
  snapToAlignment,
  ...props
}) => {
  if (loading) {
    return <Message message={translate(STRINGS.LOADING)} />;
  }
  if (error || !isEmpty(dataError)) {
    const message = error ? parseGraphqlError(error) : dataError;
    return <Message {...message} />;
  }
  if (isEmpty(items)) {
    return <Message message={translate(STRINGS.DO_NOT_HAVE_DATA)} />;
  }

  if (renderComponent) {
    return renderComponent;
  }

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={ItemSeparatorComponent}
      snapToInterval={snapToInterval}
      snapToAlignment={snapToAlignment}
      {...props}
    />
  );
};

const SectionHorizontalList = ({
  title,
  onViewMore,
  renderComponent,
  renderItem,
  items,
  loading,
  error,
  getItemLayout,
  dataError,
  keyExtractor,
  titleStyle,
  viewMoreStyle,
  totalItemCount = 0,
  maxRenderItemCount = 0,
  showViewMore = false,
  isShowTotalCount = true,
  ItemSeparatorComponent,
  containerStyle,
  titleContainerStyle,
  snapToInterval,
  snapToAlignment,
  contentContainerStyle,
  decelerationRate,
  pagingEnabled,
  disableIntervalMomentum,
}) => {
  const sectionText = isShowTotalCount ? `${title} (${totalItemCount})` : title;
  const contentProps = {
    items,
    renderComponent,
    renderItem,
    keyExtractor,
    error,
    dataError,
    loading,
    getItemLayout,
    ItemSeparatorComponent,
    snapToInterval,
    snapToAlignment,
    contentContainerStyle,
    decelerationRate,
    pagingEnabled,
    disableIntervalMomentum,
  };
  return (
    <Section
      containerStyle={containerStyle}
      titleContainerStyle={titleContainerStyle}
      titleStyle={titleStyle}
      viewMoreStyle={viewMoreStyle}
      sectionName={sectionText}
      isViewMoreVisible={showViewMore || totalItemCount > maxRenderItemCount}
      onViewMore={onViewMore}>
      <DataContent {...contentProps} />
    </Section>
  );
};

export default SectionHorizontalList;
