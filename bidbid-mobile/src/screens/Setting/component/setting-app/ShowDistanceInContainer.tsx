import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { filterDistanceSelector } from '@/redux/filters/selector';
import React, { memo, ReactElement, useState } from 'react';
import ShowDistanceSelectDialog from '../discovery/ShowDistanceSelectDialog';
import { appLocaleSelector } from '@/redux/app/selector';
import IconGrayShowDistanceSVG from '@/components/SVG/IconGrayShowDistanceSVG';

const ShowDistanceInContainer = (): ReactElement => {
  appLocaleSelector();
  const [showDistanceDialogVisible, setShowDistanceDialogVisible] = useState(false);
  //Distance
  const distance = filterDistanceSelector();
  const distanceUnit = distance ? distance.unit : null;
  const distanceDesc = distanceUnit
    ? distanceUnit === 'Km'
      ? language('settingsScreen.kmDesc')
      : language('settingsScreen.miDesc')
    : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('ShowDistanceIn')}
        content={distanceDesc}
        onPress={() => setShowDistanceDialogVisible(true)}
        image={<IconGrayShowDistanceSVG />}
      />
      <ShowDistanceSelectDialog
        isVisible={showDistanceDialogVisible}
        distanceSelected={distance.unit || null}
        distanceData={distance}
        distanceDataList={['Km', 'Mi']}
        topTitle={language('ShowDistanceIn')}
        bottomTitle={language('save')}
        onBackdropPress={() => {
          setShowDistanceDialogVisible(false);
        }}
        closeButtonOnPressed={() => {
          setShowDistanceDialogVisible(false);
        }}
        confirmOnPressedCallback={() => {
          setShowDistanceDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(ShowDistanceInContainer);
