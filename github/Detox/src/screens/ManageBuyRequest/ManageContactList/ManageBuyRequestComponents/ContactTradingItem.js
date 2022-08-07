import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import {getColorByCode} from '../../ManageBuyRequestUtils';
import ContactTradingItemStatusBanner from './ContactTradingItemStatusBanner';

const styles = StyleSheet.create({
  container: {
    ...METRICS.smallMarginTop,
    ...METRICS.padding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderColor: COLORS.GREY_F0,
    borderWidth: SIZES.BORDER_WIDTH_1,
    shadowRadius: 5,
    elevation: 3,
  },
  textValue: {
    ...FONTS.regular,
    flex: 1.5,
    fontSize: 14,
    textAlign: 'right',
  },
  textTime: {
    ...FONTS.regular,
    flex: 1.5,
    fontSize: 12,
    textAlign: 'right',
  },
  viewRow: {
    flexDirection: 'row',
    paddingTop: 12,
  },
  updateDate: {
    ...FONTS.regular,
    flex: 1,
    fontSize: 14,
    color: COLORS.BRAND_GREY,
  },
  dateView: {marginTop: 10, borderTopWidth: 2, borderColor: COLORS.SELECTED_AREA},
  containerStatus: {
    ...METRICS.tinyHorizontalPadding,
    ...METRICS.tinyVerticalPadding,
    padding: 0,
    height: 24,
    alignItems: 'center',
    backgroundColor: COLORS.GREY_E4,
    position: 'relative',
    top: 0,
    left: 0,
  },
  textStatus: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.BLACK_33,
  },
});

const getStatusStyleByName = value => {
  return {backgroundColor: getColorByCode(value)};
};

const getStatusStyle = code => {
  return {
    itemType: {...styles.containerStatus},
    itemTypeTextStyle: {...styles.textStatus},
    status: {...styles.containerStatus, ...getStatusStyleByName(code)},
    statusTextStyle: {...styles.textStatus, color: COLORS.NEUTRAL_WHITE},
  };
};

const ContactTradingItem = ({data, onPress, isSending}) => {
  const {
    statusObject,
    depositStatusName,
    contactTradingCode,
    customerFullName,
    requesterFullName,
    contactTradingId,
    date,
    propertyCode,
    price,
    districtName,
    cityName,
  } = data ?? {};

  let areaOfInterest = districtName;
  if (!isEmpty(cityName)) {
    areaOfInterest = districtName + (districtName ? ', ' : '') + cityName;
  }
  const SYMBOL_COLON = ':';
  const EMPTY_VALUE = '--';

  return (
    <>
      <TouchableOpacity
        style={[commonStyles.shadowApp, styles.container]}
        onPress={() => onPress(contactTradingId)}>
        <View style={HELPERS.rowSpaceBetweenCenter}>
          {statusObject && (
            <ContactTradingItemStatusBanner
              status={statusObject?.name + (depositStatusName ?? '')}
              customStyle={[
                styles.containerStatus,
                {backgroundColor: statusObject?.backgroundColor},
              ]}
              textStyle={[styles.textStatus, {color: statusObject?.color}]}
            />
          )}
          <Text style={styles.textTime}>{date}</Text>
        </View>

        <View style={styles.viewRow}>
          <Text style={styles.updateDate}>
            {translate(STRINGS.PROPERTY_CODE_DESC) + SYMBOL_COLON}
          </Text>
          <Text numberOfLines={1} style={styles.textValue}>
            {isEmpty(propertyCode) ? EMPTY_VALUE : propertyCode}
          </Text>
        </View>

        <View style={styles.viewRow}>
          <Text style={styles.updateDate}>{translate(STRINGS.REQUEST_CODE) + SYMBOL_COLON}</Text>
          <Text style={styles.textValue}>{contactTradingCode}</Text>
        </View>

        {isSending || (
          <View style={styles.viewRow}>
            <Text style={styles.updateDate}>{translate('contactTrading.contact')}: </Text>
            <Text style={styles.textValue} numberOfLines={2}>
              {requesterFullName}
            </Text>
          </View>
        )}

        <View style={styles.viewRow}>
          <Text style={styles.updateDate}>
            {translate(isSending ? 'contactTrading.buyer' : 'common.customer')}:{' '}
          </Text>
          <Text style={styles.textValue} numberOfLines={2}>
            {customerFullName}
          </Text>
        </View>

        {isSending && (
          <>
            <View style={styles.viewRow}>
              <Text style={styles.updateDate}>
                {translate(STRINGS.AREA_OF_INTEREST) + SYMBOL_COLON}
              </Text>
              <Text numberOfLines={1} style={styles.textValue}>
                {isEmpty(areaOfInterest) ? EMPTY_VALUE : areaOfInterest}
              </Text>
            </View>

            <View style={styles.viewRow}>
              <Text style={styles.updateDate}>
                {translate(STRINGS.PRICE_RANGE_OF_INTEREST) + SYMBOL_COLON}
              </Text>
              <Text style={styles.textValue}>{isEmpty(price) ? EMPTY_VALUE : price}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
      <View style={METRICS.marginBottom} />
    </>
  );
};

export const ContactTradingItemB2C = ({data, statusCode, isSending, onPress}) => {
  const contactTradingB2CCode = data.contactTradingB2CCode ?? '';
  const SYMBOL_COLON = ':';
  const {projectName, propertyPostCode} = data?.projectInfoDto;
  const senderTitle = isSending
    ? translate('contactTrading.sender')
    : translate('contactTrading.contact');
  const statusStyle = getStatusStyle(statusCode);
  const dateTitle = isSending
    ? translate('contactTrading.detail.createDate')
    : translate('contactTrading.detail.updateDate');

  return (
    <TouchableOpacity
      style={[styles.container, {marginTop: normal}, commonStyles.shadowApp]}
      onPress={onPress}>
      <View style={HELPERS.row}>
        <ContactTradingItemStatusBanner
          status={data?.itemType}
          customStyle={statusStyle?.itemType}
          textStyle={statusStyle?.itemTypeTextStyle}
        />
        <View style={{marginLeft: small}}>
          <ContactTradingItemStatusBanner
            status={data?.status}
            customStyle={statusStyle?.status}
            textStyle={statusStyle?.statusTextStyle}
          />
        </View>
      </View>

      <View style={styles.viewRow}>
        <Text style={styles.updateDate}>{translate('contactTrading.product') + SYMBOL_COLON}</Text>
        <Text numberOfLines={1} style={[styles.textValue, {color: COLORS.PRIMARY_A100}]}>
          {propertyPostCode}
        </Text>
      </View>

      <View style={styles.viewRow}>
        <Text style={styles.updateDate}>{translate(STRINGS.REQUEST_CODE) + SYMBOL_COLON}</Text>
        <Text style={styles.textValue}>{contactTradingB2CCode}</Text>
      </View>

      <View style={styles.viewRow}>
        <Text style={styles.updateDate}>{translate(STRINGS.PROJECT) + SYMBOL_COLON}</Text>
        <Text style={styles.textValue}>{projectName}</Text>
      </View>

      <View style={styles.viewRow}>
        <Text style={styles.updateDate}>{senderTitle + SYMBOL_COLON}</Text>
        <Text style={styles.textValue}>{data?.customerFullName}</Text>
      </View>

      <View style={[styles.viewRow, styles.dateView]}>
        <Text style={styles.updateDate}>{dateTitle + SYMBOL_COLON}</Text>
        <Text style={styles.textValue}>{data?.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContactTradingItem;
