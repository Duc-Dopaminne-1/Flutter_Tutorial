import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterSexualOrientationSelector, getFilter } from '@/redux/filters/selector';
import FilterSexualOrientationScreen from '@/screens/Filter/FilterSexualOrientationScreen/FilterSexualOrientationScreen';
import { useLocalizeNameField } from '@/shared/processing';
import React, { memo, ReactElement, useState } from 'react';
import SexSVG from '@/components/SVG/SexSVG';

const SexualOrientationContainer = (): ReactElement => {
  appLocaleSelector();
  const [sexOrientationDialogVisible, setSexOrientationDialogVisible] = useState(false);
  const sexualOrientationSelected = filterSexualOrientationSelector() || [];
  const { data } = getFilter();
  const localizeNameField = useLocalizeNameField();
  const sexualOrientationsList = data.sexualOrientationsList || [];
  const sexualOrientationNameSelected = sexualOrientationSelected
    .map(item => sexualOrientationsList.find(i => i.id === item.id) || item)
    .map(item => localizeNameField(item));
  const filterSexualOrientationDesc =
    sexualOrientationNameSelected.length > 0 ? sexualOrientationNameSelected.join(', ') + ' ' : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('sexOrientation')}
        content={filterSexualOrientationDesc}
        onPress={() => {
          setSexOrientationDialogVisible(true);
        }}
        image={<SexSVG />}
      />

      {sexOrientationDialogVisible && (
        <FilterSexualOrientationScreen
          isFromSetting
          isVisible={sexOrientationDialogVisible}
          onBackdropPress={() => {
            setSexOrientationDialogVisible(false);
          }}
        />
      )}
    </>
  );
};

export default memo(SexualOrientationContainer);
