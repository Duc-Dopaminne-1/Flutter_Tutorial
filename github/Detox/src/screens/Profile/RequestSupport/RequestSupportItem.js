import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AutoSizeText} from 'react-native-auto-size-text';

import {SUPPORT_REQUEST_STATUS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {FONT_BOLD} from '../../../assets/fonts';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import {getStatusTicket} from '../../../utils/GetMasterData';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import MeasureUtils from '../../../utils/MeasureUtils';

const extraItem = Platform.OS === 'ios' ? 0 : small;
export const ItemHeight = async item => {
  const addressSize = await MeasureUtils.measureTextSize({
    fontSize: 20,
    fontFamily: FONT_BOLD,
    text: item.supportServiceName,
    width: SCREEN_SIZE.WIDTH - normal * 2,
    lineInfoForLine: null,
  });
  return addressSize.height + 128 + extraItem;
};

const mapStatusToColor = status => {
  switch (status) {
    case SUPPORT_REQUEST_STATUS.RECEIVED.new:
      return {textColor: COLORS.ORANGE_DARK_40, backgroundColor: COLORS.ORANGE_90};
    case SUPPORT_REQUEST_STATUS.RECEIVED.confirm:
      return {textColor: COLORS.PURPLE_DARK_40, backgroundColor: COLORS.PURPLE_90};
    case SUPPORT_REQUEST_STATUS.RECEIVED.processing:
      return {textColor: COLORS.BLUE_DARK_40, backgroundColor: COLORS.BLUE_90};
    case SUPPORT_REQUEST_STATUS.RECEIVED.complete:
      return {textColor: COLORS.GREEN_DARK_40, backgroundColor: COLORS.GREEN_90};
    case SUPPORT_REQUEST_STATUS.RECEIVED.reject:
      return {textColor: COLORS.RED_DARK_40, backgroundColor: COLORS.RED_90};
    case SUPPORT_REQUEST_STATUS.RECEIVED.cancelled:
      return {textColor: COLORS.TEXT_DARK_10, backgroundColor: COLORS.GREY_ED};
    default:
      return {textColor: COLORS.TEXT_DARK_10, backgroundColor: COLORS.GREY_ED};
  }
};

const RequestSupportItem = ({item, masterData, onPress = () => {}}) => {
  const {status} = getStatusTicket(masterData, true, item?.ticketStatusId);
  const {textColor, backgroundColor} = mapStatusToColor(status);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.viewName}>
        <View style={[styles.viewLabel, {backgroundColor: backgroundColor}]}>
          <AutoSizeText
            fontSize={14}
            numberOfLines={1}
            style={[styles.textStatus, {color: textColor}]}>
            {status}
          </AutoSizeText>
        </View>
        <Text style={{backgroundColor: COLORS.NEUTRAL_WHITE}}>{item.createTime}</Text>
      </View>
      <Text style={styles.viewTitle}>{item?.servicesName}</Text>
      <View style={styles.viewCode}>
        <Text style={{color: COLORS.GRAY_A3}}>{`${translate(
          'supportRequest.detail.requestCode',
        )}:`}</Text>
        <Text>{item?.ticketCode}</Text>
      </View>
      <View style={styles.viewName}>
        <Text style={{color: COLORS.GRAY_A3}}>{`${item?.title}:`}</Text>
        <Text numberOfLines={1} style={styles.textName}>
          {item?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_LINE,
    ...commonStyles.shadowApp,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  viewLabel: {
    backgroundColor: COLORS.PRIMARY_A20,
    paddingHorizontal: 8,
    borderRadius: SIZES.BORDER_RADIUS_20,
    paddingVertical: 4,
  },
  viewCode: {flexDirection: 'row', marginVertical: small, justifyContent: 'space-between'},
  viewName: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  viewTitle: {...FONTS.bold, fontSize: 20, color: COLORS.BLACK_33, marginTop: 12},
  textName: {flex: 1, textAlign: 'right'},
  textStatus: {maxWidth: SCREEN_SIZE.WIDTH / 2},
});

export default React.memo(RequestSupportItem);
