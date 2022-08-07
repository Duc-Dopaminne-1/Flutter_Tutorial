import Proptypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  CrawlerProcessDto,
  useGetCrawlerProcessesForTopenerLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {CONSTANTS, EMPTY_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {HELPERS} from '../../../assets/theme/helpers';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import PropertyItemCrawler, {
  ItemCrawlerHeight,
} from '../../../components/PropertyItem/PropertyItemCrawler';
import {mapToUiImageSelectionSources} from '../../../utils/ImageUtil';
import {mapPropertyC2CGuarantee} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import CustomListFooter from './CustomListFooter';

const styles = StyleSheet.create({
  contentListStyle: {
    marginHorizontal: SIZES.MARGIN_12,
  },
  emptyStyle: {
    ...HELPERS.fill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PropertyCrawlerList = ({
  filter,
  totalPostsListener,
  showsVerticalScrollIndicator = true,
  onRemoveCrawler,
  onPublicCrawler,
  listRef,
  sharedValue,
  headerHeight,
  removedItemId,
}) => {
  const customListStyle = {
    ...styles.contentListStyle,
    marginTop: headerHeight,
  };

  const customEmptyContainerStyle = {
    ...styles.emptyStyle,
    marginTop: headerHeight,
  };
  const {formatPrice} = useFormatPrice();
  const renderItem = ({item}) => {
    const mappingItem = {
      ...mapPropertyC2CGuarantee(item, formatPrice, false),
      crawlerProps: {
        showCrawler: true,
        contactInfo: {
          fullname: item?.postAuthor,
          phoneNumber: item?.phone,
        },
        onRemove: onRemoveCrawler,
        onPublic: onPublicCrawler,
      },
    };

    return (
      <PropertyItemCrawler
        item={mappingItem}
        onRemoveCrawler={onRemoveCrawler}
        onPublicCrawler={onPublicCrawler}
      />
    );
  };

  const onDataChange = ({totalCount}) => {
    totalPostsListener && totalPostsListener(totalCount);
  };

  const onScroll = event => {
    const scrollingY = event.nativeEvent.contentOffset.y;
    sharedValue.value = scrollingY;
  };

  const syncList = () => {
    const scrolledPassedHeader = sharedValue.value > headerHeight;
    if (!scrolledPassedHeader) {
      const scrollToY = Math.min(sharedValue.value, headerHeight);
      listRef.current?.scrollTo({x: 0, y: scrollToY}, false);
      sharedValue.value = scrollToY;
    }
  };

  return (
    <View style={HELPERS.fill}>
      <LazyList
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentStyle={customListStyle}
        renderItem={renderItem}
        loadingFooter={CustomListFooter}
        useQuery={useGetCrawlerProcessesForTopenerLazyQuery}
        queryOptions={{
          pageSize: CONSTANTS.SMALL_PAGE_SIZE,
          variables: {...filter},
        }}
        mapToUiModel={(item: CrawlerProcessDto) => {
          return {
            ...item,
            propertyPostId: item?.crawlerProcessId,
            propertyAddress: {
              homeAddress: item?.propertyAddress,
              streetName: item?.streetName,
              wardName: item?.wardName,
              districtName: item?.districtName,
              cityName: item?.cityName,
            },
            buildingArea: item?.areaTotal,
            images: mapToUiImageSelectionSources({
              images: item?.image?.split(','),
            }),
          };
        }}
        itemHeight={item => ItemCrawlerHeight(item)}
        uniqueKey={'propertyPostId'}
        removedItemId={removedItemId}
        extractArray={response => {
          return response?.crawlerProcessesForTopener?.edges ?? [];
        }}
        extractTotalCount={response => {
          return response?.crawlerProcessesForTopener?.totalCount ?? 0;
        }}
        onDataChange={onDataChange}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        emptyType={EMPTY_TYPE.YOUR_PROPERTY_CRAWLER}
        scrollEventThrottle={6}
        scrollIndicatorInsets={{top: headerHeight}}
        onScroll={onScroll}
        onScrollEndDrag={syncList}
        onMomentumScrollEnd={syncList}
        emptyContainerStyle={customEmptyContainerStyle}
      />
    </View>
  );
};

PropertyCrawlerList.propTypes = {
  filter: Proptypes.object,
};

export default PropertyCrawlerList;
