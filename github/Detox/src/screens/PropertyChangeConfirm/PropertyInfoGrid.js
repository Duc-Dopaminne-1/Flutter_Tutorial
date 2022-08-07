import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal, small} from '../../assets/theme/metric';
import NumberUtils from '../../utils/NumberUtils';
import PropertyType from '../ManagePost/PropertyType';
import {ChangeType} from './ChangeType';
import InfoCell from './InfoCell';

const styles = StyleSheet.create({
  codeContainer: {
    flex: 2,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    marginBottom: normal,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'center',
  },
});

const Apartment = ({info, isNew, isShowPrioritize = true}) => {
  return (
    <>
      <InfoCell isNew={isNew} label={translate(STRINGS.FLOOR)} value={info.floor} />
      <InfoCell isNew={isNew} label={translate(STRINGS.BLOCK)} value={info.block} />
      {isShowPrioritize && (
        <InfoCell isNew={isNew} label={translate(STRINGS.PRIORITIZE)} value={info.prioritize} />
      )}
    </>
  );
};

const Other = ({info, isNew, isShowPrioritize = true}) => {
  return (
    <>
      <InfoCell isNew={isNew} label={translate(STRINGS.SUB_AREA)} value={info.block} />
      {isShowPrioritize && (
        <InfoCell
          isNew={isNew}
          label={translate(STRINGS.PRIORITIZE)}
          value={info.prioritize}
          style={[HELPERS.fill]}
        />
      )}
    </>
  );
};

const renderBottomInfo = (info, isNew, changeType) => {
  const isShowPrioritize = changeType === ChangeType.booking;
  if (info.type === PropertyType.apartment) {
    return <Apartment info={info} isNew={isNew} isShowPrioritize={isShowPrioritize} />;
  }
  return <Other info={info} isNew={isNew} isShowPrioritize={isShowPrioritize} />;
};

export const PersonInfo = ({info, isNew}) => {
  return (
    <View style={[HELPERS.row, METRICS.tinyMarginBottom]}>
      <InfoCell
        isNew={isNew}
        label={translate(STRINGS.NAME)}
        value={info.name}
        style={METRICS.tinyMarginEnd}
      />
      <InfoCell isNew={isNew} label={translate(STRINGS.PHONE_NUMBER)} value={info.phone} />
    </View>
  );
};

export const PlaceInfo = ({info, isNew, isShowPrioritize = true}) => {
  return (
    <View style={[HELPERS.row]}>
      <InfoCell
        isNew={isNew}
        label={translate(STRINGS.PRODUCT_CODE)}
        value={info.code}
        style={styles.codeContainer}
      />
      {info.type === PropertyType.apartment ? (
        <Apartment info={info} isNew={isNew} isShowPrioritize={isShowPrioritize} />
      ) : (
        <Other info={info} isNew={isNew} isShowPrioritize={isShowPrioritize} />
      )}
    </View>
  );
};

const getTitle = isNew => {
  return isNew ? translate(STRINGS.NEW_PRODUCT) : translate(STRINGS.CURRENT_PRODUCT);
};

const mapToInfo = (property, consultantInfo, isNew) => {
  const price = isNew
    ? property.propertyPrice
    : `${NumberUtils.formatNumber(Math.max(property.priceVat, property.priceNoVat))} VND`;
  return {
    type: property?.propertyTypeName ?? '',
    name: consultantInfo?.fullName ?? '',
    phone: consultantInfo?.phoneNumber ?? '',
    code: property?.propertyCode ?? '',
    floor: property?.floor ?? '',
    block: property?.blockName ?? '',
    prioritize: '',
    price: price,
  };
};

const PropertyInfoGrid = ({property, consultantInfo, changeType, isNew = false}) => {
  const info = mapToInfo(property, consultantInfo, isNew);
  const title = getTitle(isNew);
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={METRICS.horizontalPadding}>
        <View style={[HELPERS.row, {marginBottom: small}]}>
          <InfoCell
            label={translate('changeProperty.propertyCode')}
            value={info.code}
            style={styles.codeContainer}
          />
          {renderBottomInfo(info, isNew, changeType)}
        </View>
        <View style={[HELPERS.row]}>
          <InfoCell
            isNew={isNew}
            label={translate('changeProperty.priceNoVat')}
            value={info.price}
          />
        </View>
      </View>
    </View>
  );
};

export default PropertyInfoGrid;
