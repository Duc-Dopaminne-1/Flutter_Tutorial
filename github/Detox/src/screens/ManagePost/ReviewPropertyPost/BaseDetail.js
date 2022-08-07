import React from 'react';
import {View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import MeasureUtils from '../../../utils/MeasureUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {PROPERTY_LOCATION_BY_NAME} from '../PropertyPostUtils';
import PropertyType from '../PropertyType';
import {HorizontalInfoCell} from './components/InfoCell';

const LandDetail = ({legalStatus, propertyStatus, mortgaged, mortgagedBank, isCreatedUser}) => {
  return (
    <>
      {!!propertyStatus && (
        <HorizontalInfoCell label={translate(STRINGS.CURRENT_STATUS)} value={propertyStatus} />
      )}
      {!!legalStatus && (
        <HorizontalInfoCell label={translate(STRINGS.LEGAL_TYPE)} value={legalStatus} />
      )}
      {mortgaged && isCreatedUser && (
        <HorizontalInfoCell label={translate(STRINGS.MORTGAGED)} value={mortgagedBank} />
      )}
    </>
  );
};

const VillaDetail = ({
  capetAreas,
  numberOfFloor,
  legalStatus,
  propertyStatus,
  mortgaged,
  mortgagedBank,
  isCreatedUser,
}) => {
  const valueCapetAreas = NumberUtils.parseFloatValue(capetAreas);
  return (
    <>
      {valueCapetAreas > 0 && (
        <HorizontalInfoCell
          label={translate(STRINGS.USAGE_ACREAGE_SHORTEN)}
          value={MeasureUtils.getSquareMeterText(capetAreas)}
        />
      )}
      {!!numberOfFloor && (
        <HorizontalInfoCell
          label={translate(STRINGS.NUMBER_OF_FLOOR)}
          isShowSeparator={false}
          value={numberOfFloor}
        />
      )}
      {!!propertyStatus && (
        <HorizontalInfoCell label={translate(STRINGS.CURRENT_STATUS)} value={propertyStatus} />
      )}
      {!!legalStatus && (
        <HorizontalInfoCell
          label={translate(STRINGS.LEGAL_TYPE)}
          isShowSeparator={false}
          value={legalStatus}
        />
      )}
      {mortgaged && isCreatedUser && (
        <HorizontalInfoCell label={translate(STRINGS.MORTGAGED)} value={mortgagedBank} />
      )}
    </>
  );
};

const BaseDetail = ({
  propertyName,
  propertyType,
  length,
  width,
  forRent,
  propertyLocation,
  alleyWidth,
  rentPeriod,
  direction,
  legalStatus,
  propertyStatus,
  mortgaged,
  mortgagedBank,
  isCreatedUser,
  capetAreas,
  numberOfFloor,
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
      {!!direction && <HorizontalInfoCell label={translate(STRINGS.DIRECTION)} value={direction} />}
      {!!propertyLocation && propertyLocation !== 'UNDEFINED' && (
        <HorizontalInfoCell
          label={translate('newPost.location')}
          value={`${PROPERTY_LOCATION_BY_NAME[propertyLocation]}`}
        />
      )}
      {alleyWidth > 0 && (
        <HorizontalInfoCell label={translate('newPost.alleyWidth')} value={`${alleyWidth}m`} />
      )}
      {propertyType === PropertyType.land && (
        <LandDetail
          legalStatus={legalStatus}
          propertyStatus={propertyStatus}
          mortgaged={mortgaged}
          mortgagedBank={mortgagedBank}
          isCreatedUser={isCreatedUser}
        />
      )}
      {(propertyType === PropertyType.villa || propertyType === PropertyType.house) && (
        <VillaDetail
          capetAreas={capetAreas}
          numberOfFloor={numberOfFloor}
          legalStatus={legalStatus}
          propertyStatus={propertyStatus}
          mortgaged={mortgaged}
          mortgagedBank={mortgagedBank}
          isCreatedUser={isCreatedUser}
        />
      )}
      {forRent && <HorizontalInfoCell label={translate(STRINGS.RENTAL_TIME)} value={rentPeriod} />}
    </View>
  );
};

export default BaseDetail;
