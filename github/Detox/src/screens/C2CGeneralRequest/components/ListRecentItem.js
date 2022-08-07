import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {memo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import ScreenIds from '../../ScreenIds';

const ListRecentItem = ({item, isFirstItem = false}) => {
  const navigation = useNavigation();
  if (isEmpty(item)) return null;

  const onPressViewPropertyPost = () => {
    navigation.navigate(ScreenIds.ViewPropertyPost, {
      propertyPostId: item?.propertyPostId,
      viewByOtherMode: false,
    });
  };

  const onPressViewContactTradingId = () => {
    navigation.navigate(ScreenIds.RequestDetailStack, {
      screen: ScreenIds.RequestDetail,
      params: {
        requestId: item?.contactTradingId,
        isSending: true,
      },
    });
  };

  return (
    <View style={[styles.container, isFirstItem && styles.firstItem]}>
      <View style={[styles.row]}>
        <View style={[styles.statusBox, {backgroundColor: item?.contactTradingStatusBgColor}]}>
          <Text style={[styles.status, {color: item?.contactTradingStatusColor}]}>
            {item?.contactTradingStatusName}
          </Text>
        </View>
        <Text style={styles.status}>{item?.createdDatetime}</Text>
      </View>
      <Text style={styles.title}>{item?.title}</Text>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate(STRINGS.PROPERTY_CODE_DESC)}</Text>
        <TouchableOpacity style={styles.itemRight} onPress={onPressViewPropertyPost}>
          <Text style={[styles.value, styles.itemRightValue]}>{item?.propertyCode}</Text>
          <Image
            style={{tintColor: COLORS.PRIMARY_A100}}
            source={IMAGES.ARROW_RIGHT_LINEAR}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.row, METRICS.smallMarginTop]}>
        <Text style={styles.label}>{translate('c2CGeneralRequest.generalRequestCode')}</Text>
        <TouchableOpacity style={styles.itemRight} onPress={onPressViewContactTradingId}>
          <Text style={[styles.value, styles.itemRightValue]}>{item?.contactTradingCode}</Text>
          <Image
            style={{tintColor: COLORS.PRIMARY_A100}}
            source={IMAGES.ARROW_RIGHT_LINEAR}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    padding: normal,
    borderTopWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_DIVIDER,
  },
  firstItem: {
    borderTopWidth: 0,
  },
  statusBox: {
    backgroundColor: COLORS.GRAY_ED,
    borderRadius: SIZES.BORDER_RADIUS_20,
    paddingVertical: SIZES.MARGIN_2,
    paddingHorizontal: normal,
    alignSelf: 'flex-start',
  },
  status: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_12,
    color: COLORS.BLACK_31,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BRAND_GREY,
    marginRight: small,
  },
  value: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_BLACK,
    textAlign: 'right',
  },
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRightValue: {
    color: COLORS.PRIMARY_A100,
  },
});

export default memo(ListRecentItem);
