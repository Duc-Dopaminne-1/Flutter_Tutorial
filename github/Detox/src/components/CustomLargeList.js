import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';

import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';

const CustomLargeList = ({
  listRef,
  renderIndexPath,
  refreshHeader,
  loadingFooter,
  onRefresh,
  onLoading,
  data,
  uniqueKey,
  style,
}) => {
  const renderSections = sections => {
    const items = sections[0].items ?? [];
    if (isEmpty(items)) {
      return null;
    }
    const nodes = [];
    const length = items.length;
    for (let i = 0; i < length; i++) {
      const itemKey = `${items[i][uniqueKey]}${i}`;
      nodes.push(<View key={itemKey}>{renderIndexPath({section: 0, row: i})}</View>);
    }
    return nodes;
  };

  return (
    <SpringScrollView
      contentStyle={METRICS.paddingBottom}
      style={[HELPERS.fill, style]}
      ref={listRef}
      onRefresh={onRefresh}
      refreshHeader={refreshHeader}
      loadingFooter={loadingFooter}
      onLoading={onLoading}>
      {renderSections(data)}
    </SpringScrollView>
  );
};

export default React.memo(CustomLargeList);
