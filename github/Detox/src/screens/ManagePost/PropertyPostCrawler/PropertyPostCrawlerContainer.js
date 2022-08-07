import React, {useRef} from 'react';
import {Platform, Text, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {CONSTANTS, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {medium, METRICS, micro, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomTotalCount from '../../../components/CustomTotalCount';
import {SizeBox} from '../../../components/SizeBox';
import SearchHeader from '../../Search/components/SearchHeader';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import CrawlerBoardView from './CrawlerBoardView';
import PropertyCrawlerList from './PropertyCrawlerList';

const AnimatedHeader = ({
  animatedValue,
  headerHeight,
  showFilter,
  onKeywordChange,
  postCount,
  summary,
}) => {
  const viewAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: COLORS.NEUTRAL_WHITE,
    transform: [
      {
        translateY: interpolate(
          animatedValue?.value,
          [0, headerHeight],
          [0, -headerHeight + CONSTANTS.HEADER_CONTAINER_HEIGHT * 2],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const searchBar = useAnimatedStyle(() => ({
    backgroundColor: COLORS.NEUTRAL_WHITE,
    transform: [
      {
        translateY: interpolate(
          animatedValue?.value,
          [0, headerHeight],
          [0, Platform.OS === 'ios' ? 10 : 0],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  // Magic blink
  const cardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedValue?.value, [0, headerHeight / 2], [1, 0], Extrapolate.CLAMP),
  }));

  const headerContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    height: interpolate(
      animatedValue?.value,
      [0, headerHeight],
      [headerHeight, CONSTANTS.HEADER_CONTAINER_HEIGHT + medium * 1.5], // I see a miracle!
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <Animated.View style={headerContainerStyle}>
      <Animated.View style={viewAnimatedStyle}>
        <Animated.View style={cardStyle}>
          <View style={{backgroundColor: COLORS.LINE_COLOR, height: micro}} />
          <View style={[METRICS.horizontalPadding, METRICS.smallVerticalPadding]}>
            <Text style={[commonStyles.grayText14, FONTS.fontSize16, HELPERS.textJustify]}>
              {translate('propertyPost.crawler.description')}
            </Text>
          </View>
          <View style={[commonStyles.separatorRow8, {backgroundColor: COLORS.LINE_COLOR}]} />
          <CrawlerBoardView style={METRICS.horizontalPadding} data={summary} />
          <View style={[commonStyles.separatorRow8, {backgroundColor: COLORS.LINE_COLOR}]} />
        </Animated.View>
        <Animated.View style={[NewPostStyles.viewWithIndex, searchBar]}>
          <SearchHeader
            renderLeft={false}
            placeholder={translate('common.searchTitlePlaceholder')}
            customStyle={commonStyles.inputSearch}
            onFilterPress={showFilter}
            onChangeKeyword={onKeywordChange}
            maxLength={MAX_LENGTH.NOTE}
            delayTimeout={100}
          />
          <CustomTotalCount
            containerStyle={[METRICS.resetMargin, {marginBottom: small}]}
            count={postCount}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const PropertyPostCrawlerContainer = ({
  filter,
  showFilter,
  onKeywordChange,
  postCount,
  removedItemId,
  summary,
  onChangeTotalPost,
  onRemoveCrawler,
  onPublicCrawler,
}) => {
  const listRef = useRef(null);
  const sharedValue = useSharedValue(0);
  const headerHeight = 300;

  return (
    <View style={HELPERS.fill}>
      <AnimatedHeader
        animatedValue={sharedValue}
        postCount={postCount}
        summary={summary}
        onKeywordChange={onKeywordChange}
        showFilter={showFilter}
        headerHeight={headerHeight}
      />
      <SizeBox height={SIZES.SEPARATOR_8} />
      <PropertyCrawlerList
        filter={filter}
        totalPostsListener={onChangeTotalPost}
        showsVerticalScrollIndicator={false}
        onPublicCrawler={onPublicCrawler}
        onRemoveCrawler={onRemoveCrawler}
        listRef={listRef}
        removedItemId={removedItemId}
        sharedValue={sharedValue}
        headerHeight={headerHeight}
      />
    </View>
  );
};

export default PropertyPostCrawlerContainer;
