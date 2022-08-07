import React from 'react';
import {View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import NumberUtils from '../../../utils/NumberUtils';
import {HorizontalInfoCell} from './components/InfoCell';

const ApartmentDetail = ({
  propertyName,
  propertyStatus,
  tower,
  floor,
  legalStatus,
  mortgaged,
  mortgagedBank,
  isCreatedUser,
  rentPeriod,
  forRent,
  length,
  width,
  balconyDirection,
  direction,
  ProjectItem,
}) => {
  const valueLength = NumberUtils.parseFloatValue(length);
  const valueWidth = NumberUtils.parseFloatValue(width);

  return (
    <View>
      <HorizontalInfoCell label={translate(STRINGS.TYPE)} value={propertyName} />
      {ProjectItem}
      {valueLength > 0 && (
        <HorizontalInfoCell label={translate('newPost.length')} value={`${valueLength}m`} />
      )}
      {valueWidth > 0 && (
        <HorizontalInfoCell label={translate('newPost.width')} value={`${valueWidth}m`} />
      )}
      {!!tower && <HorizontalInfoCell label={translate(STRINGS.TOWER)} value={tower} />}
      {!!floor && (
        <HorizontalInfoCell
          label={translate(STRINGS.FLOOR)}
          isShowSeparator={false}
          value={floor}
        />
      )}
      {!!direction && <HorizontalInfoCell label={translate(STRINGS.DIRECTION)} value={direction} />}
      {!!balconyDirection && (
        <HorizontalInfoCell label={translate(STRINGS.BALCONY_DIRECTION)} value={balconyDirection} />
      )}
      {!!legalStatus && (
        <HorizontalInfoCell label={translate(STRINGS.CURRENT_STATUS)} value={propertyStatus} />
      )}
      {!!legalStatus && (
        <HorizontalInfoCell
          label={translate(STRINGS.LEGAL_TYPE)}
          isShowSeparator={false}
          value={legalStatus}
        />
      )}
      {forRent && <HorizontalInfoCell label={translate(STRINGS.RENTAL_TIME)} value={rentPeriod} />}
      {mortgaged && isCreatedUser && (
        <HorizontalInfoCell label={translate(STRINGS.MORTGAGED)} value={mortgagedBank} />
      )}
    </View>
  );
};

export default ApartmentDetail;
