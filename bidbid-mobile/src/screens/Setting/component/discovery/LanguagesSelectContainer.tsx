import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterLanguageSelector, getFilter } from '@/redux/filters/selector';
import { useLocalizeNameField } from '@/shared/processing';
import React, { memo, ReactElement, useState } from 'react';
import LanguagesSelectDialog from './LanguagesSelectDialog';
import IconGrayDisoveryLanguagesSVG from '@/components/SVG/IconGrayDisoveryLanguagesSVG';

const LanguagesSelectContainer = (): ReactElement => {
  const { data } = getFilter();
  appLocaleSelector();
  const localizeNameField = useLocalizeNameField();
  const [languagesDialogVisible, setLanguagesDialogVisible] = useState(false);
  const languagesSelected = filterLanguageSelector() || [];

  const languagesList = data?.languagesList || [];
  const languagesSelectedName = languagesSelected
    .map(item => languagesList.find(i => i.id === item.id) || item)
    .map(item => localizeNameField(item));
  const languagesDesc = languagesSelectedName.length > 0 ? languagesSelectedName.join(', ') + ' ' : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('languages')}
        content={languagesDesc}
        onPress={() => setLanguagesDialogVisible(true)}
        image={<IconGrayDisoveryLanguagesSVG />}
      />

      {languagesDialogVisible && (
        <LanguagesSelectDialog
          isVisible={languagesDialogVisible}
          topTitle={language('languages')}
          bottomTitle={language('save')}
          languagesList={languagesList}
          languagesSelectedList={languagesSelected}
          onBackdropPress={() => {
            setLanguagesDialogVisible(false);
          }}
          confirmOnPressedCallback={() => {
            setLanguagesDialogVisible(false);
          }}
        />
      )}
    </>
  );
};

export default memo(LanguagesSelectContainer);
