import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import {EmptyListView} from '../../../components/List/EmptyListView';
import HomePropertyItem from '../../../components/PropertyItem/HomePropertyItem';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import MeasureUtils from '../../../utils/MeasureUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {projectPaddingStyle} from '../../../utils/RenderUtil';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';

const styles = StyleSheet.create({
  emptyView: {height: 200, width: SCREEN_SIZE.WIDTH},
});

const ListProperty = ({items, actions, showBrokenInfo = true}) => {
  const navigation = useNavigation();
  const {track} = useAnalytics();

  const renderItem = ({item, index}) => {
    const openPropertyDetail = postInfo => {
      let emptyValue;

      track(TrackingActions.productClicked, {
        category: Category.buy,
        click_location: ClickLocation.home,
        name: postInfo?.title,
        address: postInfo?.address,
        price: MeasureUtils.getPriceFromPriceDescription(postInfo?.price) ?? 0,
        commission: postInfo?.commission,
        image_url: postInfo?.images ?? '',
        apartment_area: NumberUtils.parseFloatValue(postInfo?.buildingArea) || emptyValue,
        direction: postInfo?.direction ?? '',
        bedroom_number: NumberUtils.parseFloatValue(postInfo?.numberOfBedrooms) || emptyValue,
        bathroom_number: NumberUtils.parseFloatValue(postInfo?.numberOfBathrooms) || emptyValue,
      });

      navigation.push(ScreenIds.ViewPropertyPost, {
        propertyPostId: postInfo?.propertyPostId,
        viewByOtherMode: true,
      });
    };

    return (
      <HomePropertyItem
        showBrokenInfo={showBrokenInfo}
        style={projectPaddingStyle(index)}
        {...item}
        actions={actions}
        onPress={openPropertyDetail}
      />
    );
  };

  if (isEmpty(items)) {
    return (
      <View style={HELPERS.center}>
        <Text style={commonStyles.blackText14}>{translate(STRINGS.DO_NOT_HAVE_DATA)}</Text>
      </View>
    );
  }

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.propertyPostId}
      horizontal
      ListEmptyComponent={() => (
        <View style={styles.emptyView}>
          <EmptyListView />
        </View>
      )}
      data={items}
      renderItem={renderItem}
    />
  );
};

export default ListProperty;
