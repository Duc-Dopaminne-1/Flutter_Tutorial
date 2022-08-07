import React from 'react';
import {View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import HomePropertyItem, {CARD_WIDTH} from '../../../../components/PropertyItem/HomePropertyItem';
import SectionHorizontalList from '../../../../components/SectionHorizontalList';
import {projectPaddingStyle} from '../../../../utils/RenderUtil';

const SimilarPostsView = ({
  posts,
  onPressSimilarPost,
  loading,
  onInteractionWithPost,
  isTesting = false,
  onPressViewMore,
}) => {
  const openPropertyDetail = postId => {
    onPressSimilarPost && onPressSimilarPost(postId);
  };

  return (
    <SectionHorizontalList
      loading={loading}
      isShowTotalCount={false}
      totalItemCount={posts?.length}
      maxRenderItemCount={6}
      onViewMore={onPressViewMore}
      showViewMore
      containerStyle={METRICS.resetMargin}
      contentContainerStyle={[METRICS.smallHorizontalPadding, METRICS.paddingBottom]}
      titleContainerStyle={[METRICS.resetMargin, METRICS.marginBottom, METRICS.horizontalPadding]}
      titleStyle={commonStyles.blackTextBold20}
      title={translate('propertyPost.similarProperty')}
      renderItem={({item, index, ...otherProps}) => {
        return (
          <View style={[HELPERS.fill]}>
            <HomePropertyItem
              {...otherProps}
              showBrokenInfo
              style={projectPaddingStyle(index)}
              onPress={() => openPropertyDetail(item.propertyPostId)}
              actions={{
                updateItem: followedItemProps => {
                  onInteractionWithPost && onInteractionWithPost(followedItemProps);
                },
              }}
              isShowFollowButton={!isTesting}
              {...item}
            />
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View style={commonStyles.separatorColumn8} />}
      items={posts}
      keyExtractor={item => item?.propertyPostId}
      snapToAlignment="center"
      snapToInterval={CARD_WIDTH + 26}
      getItemLayout={(items, index) => ({
        length: CARD_WIDTH,
        offset: CARD_WIDTH * index,
        index,
      })}
      disableIntervalMomentum
    />
  );
};

export default SimilarPostsView;
