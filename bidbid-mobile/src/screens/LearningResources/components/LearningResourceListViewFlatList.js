import React, {useRef, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {METRICS} from '../../../assets/theme/metric';
import {LearningResourceItem} from './LearningResourceKnowledgeItem';
import LearningResourceListViewItem from './LearningResourceListViewItem';

interface LearningResourceListViewFlatListProps {
  listResource: LearningResourceItem[];
  title?: string;
  shouldUseFlatList?: boolean;
  onLoadMore?: () => void;
}

function LearningResourceListViewFlatList(
  props: LearningResourceListViewFlatListProps,
): React.ReactElement {
  const {listResource, title, shouldUseFlatList = true, onLoadMore} = props;
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const shouldShowLoadingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);
  const keyExtractor = item => item.id + item.title;

  const renderItem = ({item}) => {
    return <LearningResourceListViewItem item={item} />;
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
    if (shouldUseFlatList && !isLoadingBottom && !onEndReachedCalledDuringMomentumRef.current) {
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

  if (shouldUseFlatList) {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={listResource}
        renderItem={renderItem}
        style={styles.flatList}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={onMomentumScrollBegin}
      />
    );
  }

  return listResource.map(item => (
    <LearningResourceListViewItem subTitle={title} key={item.id} item={item} />
  ));
}
export default LearningResourceListViewFlatList;

const styles = StyleSheet.create({
  flatList: {
    marginRight: SIZES.MARGIN_16,
  },
});
