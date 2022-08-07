import React from 'react';
import {Dimensions, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {withSpring} from 'react-native-reanimated';

import {MAP_PROPERTY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small} from '../../assets/theme/metric';
import {getPriceForSlot} from '../../utils/getPropertyPrice';
import {formatDirection} from '../Home/TopenerOfMonth/types';
import {FloorSection} from './components/FloorSection';
import {routeKeys} from './FloorTabContext';
import SlotSelectionUtil, {
  BOOKED_PROPERTY_STATUS,
  DEFAULT_NUMBER_COLUMN,
  EMPTY_PROPERTY_STATUS,
  SOLD_PROPERTY_STATUS,
} from './SlotSelectionUtil';
import {useFloorList} from './useFloorList';

const AnimatedSelection = Animated.createAnimatedComponent(SectionList);
const screenWidth = Dimensions.get('window').width;
const indexWidth = normal;
const itemMargin = normal;
const widgetWidth = (screenWidth - indexWidth * 2 - normal) / DEFAULT_NUMBER_COLUMN;
const styles = StyleSheet.create({
  gridContainer: {
    ...HELPERS.rowWrap,
    ...HELPERS.fill,
    marginStart: indexWidth,
  },
  propertyContainer: {
    ...METRICS.marginBottom,
    marginEnd: itemMargin,
    backgroundColor: COLORS.CIRCLE_BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: widgetWidth,
    borderWidth: SIZES.BORDER_WIDTH_1,
    padding: 8,
  },
  propertyType: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  emptyMessage: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
  propertyCode: {
    backgroundColor: COLORS.BOOKING_COMPLETED,
    alignSelf: 'flex-start',
    height: 30,
    ...HELPERS.center,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

const InfoText = ({text, textStyle, textColor = COLORS.TEXT_DARK_10, title}) => {
  return (
    <View style={[HELPERS.rowSpaceBetween, METRICS.tinyMarginTop]}>
      <Text style={{color: COLORS.TEXT_DARK_40, ...FONTS.regular}}>{title}</Text>
      <Text style={[{color: textColor, ...FONTS.regular}, textStyle]}>{text}</Text>
    </View>
  );
};

export const PropertyItem = ({
  item,
  status,
  propertyType = 'apartment',
  projectStatus,
  onPress,
}) => {
  const {propertyCode, priceVat, priceNoVat, direction, buildingArea} = item;
  const {color, border, propertyBackgroundColor, propertyTextColor} =
    SlotSelectionUtil.saleTrackingColor(status);
  const originPrice = getPriceForSlot({priceVat, priceNoVat, projectStatus});
  const itemPrice = originPrice ? ` ${originPrice}` : ' -';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.propertyContainer, {backgroundColor: color, borderColor: border}]}>
      <View style={styles.propertyType}>
        <View style={[styles.propertyCode, {backgroundColor: propertyBackgroundColor}]}>
          <Text style={{color: propertyTextColor, ...FONTS.bold}}>{propertyCode}</Text>
        </View>
        <Text style={{...FONTS.regular}}>{MAP_PROPERTY[propertyType].name}</Text>
      </View>
      <View style={{height: small}} />
      <InfoText
        text={`Từ${itemPrice}`}
        textStyle={FONTS.bold}
        textColor={COLORS.PRIMARY_B100}
        title={'Giá'}
      />
      <InfoText text={`${buildingArea ?? '-'}m2`} title={'Diện tích'} />
      <InfoText text={formatDirection(direction) ?? '-'} title={'Hướng'} />
    </TouchableOpacity>
  );
};

const renderSectionHeader = ({section: {floor, total, floorPlanPhotos}}) => {
  return <FloorSection floor={floor} total={total} images={floorPlanPhotos} />;
};

const renderRow = ({row, propertyType, projectStatus, onPressItem, isAgentUser}) => {
  return (
    <View style={styles.gridContainer}>
      {row.map((item, index) => (
        <PropertyItem
          isAgentUser={isAgentUser}
          onPress={() => onPressItem(item)}
          status={item.saleTrackingStatusName}
          projectStatus={projectStatus}
          propertyType={propertyType}
          key={item.propertyPostId ?? `${index}`}
          item={item}
          index={index}
        />
      ))}
    </View>
  );
};

export const EmptyList = (
  <Text style={styles.emptyMessage}>{translate(STRINGS.DO_NOT_HAVE_DATA)}</Text>
);

const keyExtractor = (item, index) => {
  const key = `${item[0].propertyPostId ?? ''}${index}`;
  return key;
};

const getStatusListByRouteKey = routeKey => {
  return {
    [routeKeys.all]: [],
    [routeKeys.booked]: BOOKED_PROPERTY_STATUS,
    [routeKeys.empty]: EMPTY_PROPERTY_STATUS,
    [routeKeys.deposit]: SOLD_PROPERTY_STATUS,
  }[routeKey ?? routeKeys.all];
};

export const getSectionsData = (propertyPosts, routeKey) => {
  const statusList = getStatusListByRouteKey(routeKey);
  return SlotSelectionUtil.extractFloorData(propertyPosts, statusList);
};

const FloorList = props => {
  const data = useFloorList({...props});
  return <FloorView {...data} />;
};

export default React.memo(FloorList);

export type FloorViewProps = {
  sections: any,
  propertyType: any,
  projectStatus: any,
  onPressItem: (item: {}) => {},
  isAgentUser: any,
  onScrollEndDrag: () => {},
  handleScrollAnimated: () => {},
  scrollSelectionList: any,
  POSTION_TOP_LIST: any,
};

export const FloorView = ({
  sections = [],
  propertyType,
  projectStatus,
  isAgentUser,
  handleScrollAnimated = () => {},
  POSTION_TOP_LIST,
  ...props
}: FloorViewProps) => {
  const onScrollEndDrag = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (props?.scrollSelectionList?.value) {
      if (offsetY >= 40 && offsetY < 80) {
        props.scrollSelectionList.value = withSpring(80);
      } else if (offsetY >= 0 && offsetY < 40) {
        props.scrollSelectionList.value = withSpring(5);
      }
    }
  };

  return (
    <AnimatedSelection
      stickySectionHeadersEnabled={false}
      sections={sections}
      keyExtractor={keyExtractor}
      overScrollMode="never"
      renderItem={({item: row}) =>
        renderRow({
          row,
          propertyType,
          projectStatus,
          onPressItem: props.onPressItem,
          isAgentUser: isAgentUser,
        })
      }
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      nestedScrollEnabled
      scrollEventThrottle={16}
      onScrollEndDrag={onScrollEndDrag}
      onScroll={handleScrollAnimated}
      contentContainerStyle={{paddingTop: POSTION_TOP_LIST}}
      renderSectionHeader={renderSectionHeader}
    />
  );
};
