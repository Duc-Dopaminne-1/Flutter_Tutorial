import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterCareerStrengsSelector, getFilter } from '@/redux/filters/selector';
import { useLocalizeNameField } from '@/shared/processing';
import { IconCareerStrengthsSetting } from '@/vars/imagesSvg';
import React, { memo, ReactElement, useMemo, useState } from 'react';
import CareerStrengthsDialog from './CareerStrengthsDialog';

const CareerStrengthsContainer = (): ReactElement => {
  const [careerStrengthsDialogVisible, setCareerStrengthsDialogVisible] = useState(false);
  const careerStrengsSelected = filterCareerStrengsSelector() || [];
  const { data } = getFilter();
  const { careerStrengthsList = [] } = data;
  const localizeNameField = useLocalizeNameField();
  const careerSelected = useMemo(
    () => careerStrengsSelected.map(item => careerStrengthsList.find(i => i.id === item.id) || item).map(item => localizeNameField(item)),
    [careerStrengsSelected, careerStrengthsList, appLocaleSelector()],
  );
  const filterCareerDesc = careerSelected.length > 0 ? careerSelected.join(', ') + ' ' : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('filterScreen.careerStrengths')}
        content={filterCareerDesc}
        onPress={() => setCareerStrengthsDialogVisible(true)}
        image={<IconCareerStrengthsSetting />}
      />
      <CareerStrengthsDialog
        isVisible={careerStrengthsDialogVisible}
        careerStrengsSelected={careerStrengsSelected}
        careerStrengsList={careerStrengthsList}
        onBackdropPress={() => {
          setCareerStrengthsDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(CareerStrengthsContainer);
