import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { filterDistanceSelector, filterGlobalSelector, filterSelector } from '@/redux/filters/selector';
import FilterLocationScreen from '@/screens/Filter/FilterLocationScreen';
import React, { memo, ReactElement, useState } from 'react';
import IconGrayLocationSVG from '@/components/SVG/IconGrayLocationSVG';

const LocationContainer = (): ReactElement => {
  const distance = filterDistanceSelector();
  const global = filterGlobalSelector();
  const filterData = filterSelector();
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);

  const filterMaxDistanceDesc = distance
    ? `${distance.max}${distance.unit === 'Mi' ? 'mi' : 'km'} ${language('max')}`
    : language('filterScreen.none');

  if (global) return null;
  return (
    <>
      <CustomItemSetting
        title={language('location')}
        isFromLocation
        countryDesc={filterData.hasOwnProperty('location') ? filterData.location?.name : ''}
        content={filterMaxDistanceDesc}
        onPress={() => setLocationDialogVisible(true)}
        image={<IconGrayLocationSVG />}
      />

      <FilterLocationScreen
        isFromSetting
        isVisible={locationDialogVisible}
        onBackdropPress={() => {
          setLocationDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(LocationContainer);
