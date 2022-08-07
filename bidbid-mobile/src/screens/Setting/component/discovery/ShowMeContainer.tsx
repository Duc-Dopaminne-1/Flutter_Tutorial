import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterGenderSelector, getFilter } from '@/redux/filters/selector';
import { sortArrayByOrder, useLocalizeGenderName } from '@/shared/processing';
import React, { memo, ReactElement, useMemo, useState } from 'react';
import ShowMeSelectDialog from './ShowMeSelectDialog';
import IconGrayShowMeSVG from '@/components/SVG/IconGrayShowMeSVG';

const ShowMeContainer = (): ReactElement => {
  const [showMeDialogVisible, setShowMeDialogVisible] = useState(false);
  const genders = filterGenderSelector() || [];
  const getGenderName = useLocalizeGenderName();
  const gendersList = useMemo(() => sortArrayByOrder(getFilter().data.gendersList), []) || [];
  const genderNameSelected = useMemo(
    () => sortArrayByOrder(genders.map(item => gendersList.find(i => i.id === item.id) || item)).map(item => getGenderName(item)),
    [genders, gendersList, appLocaleSelector()],
  );
  const showMeDecs = genderNameSelected.length > 0 ? genderNameSelected.join(', ') + ' ' : language('filterScreen.none');
  return (
    <>
      <CustomItemSetting
        title={language('showMe')}
        content={showMeDecs}
        onPress={() => setShowMeDialogVisible(true)}
        image={<IconGrayShowMeSVG />}
      />
      {/* Show Me Modal */}
      <ShowMeSelectDialog
        isVisible={showMeDialogVisible}
        genderList={gendersList}
        genderSelected={genders || []}
        topTitle={language('showMe')}
        bottomTitle={language('save')}
        onBackdropPress={() => {
          setShowMeDialogVisible(false);
        }}
        closeButtonOnPressed={() => {
          setShowMeDialogVisible(false);
        }}
        confirmOnPressedCallback={() => {
          setShowMeDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(ShowMeContainer);
