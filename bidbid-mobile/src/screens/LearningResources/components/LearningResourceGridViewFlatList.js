import React, {useRef, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import {METRICS} from '../../../assets/theme/metric';
import LearningResourceGridViewItem from './LearningResourceGridViewItem';
import {LearningResourceItem} from './LearningResourceKnowledgeItem';

interface LearningResourceGridViewProps {
  listResource: LearningResourceItem[];
  shouldUseLoadMore?: boolean;
  onLoadMore?: () => void;
}

export function LearningResourceGridViewFlatList(
  props: LearningResourceGridViewProps,
): React.ReactElement {
  const {listResource, shouldUseLoadMore = true, onLoadMore} = props;
  const keyExtractor = item => item.id + item.title;
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const shouldShowLoadingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);

  const renderItem = ({item}) => {
    return <LearningResourceGridViewItem item={item} />;
  };

  const renderFooter = () => {
    if (!isLoadingBottom) return null;
    return (
      <View style={{...METRICS.marginRight}}>
        <ActivityIndicator />
      </View>
    );
  };

  const handleLoadMore = async () => {
    if (shouldUseLoadMore && !isLoadingBottom && !onEndReachedCalledDuringMomentumRef.current) {
      onEndReachedCalledDuringMomentumRef.current = true;
      setIsLoadingBottom(true);
      shouldShowLoadingRef.current = true;

      onLoadMore &&
        onLoadMore(() => {
          setIsLoadingBottom(false);
          shouldShowLoadingRef.current = false;
        });

      setTimeout(() => {
        if (shouldShowLoadingRef.current) {
          setIsLoadingBottom(false);
        }
      }, 1500);
    }
  };

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentumRef.current = false;
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      numColumns={2}
      data={listResource}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.1}
      onEndReached={handleLoadMore}
      onMomentumScrollBegin={onMomentumScrollBegin}
    />
  );
}
