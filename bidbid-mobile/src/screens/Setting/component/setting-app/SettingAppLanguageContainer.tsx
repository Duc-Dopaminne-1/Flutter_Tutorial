import CustomItemSetting from '@/components/CustomItemSetting';
import { changeLocaleLocal, language } from '@/i18n';
import { changeLocale } from '@/redux/app/actions';
import { RootState } from '@/redux/reducers';
import { updateAppLanguage } from '@/redux/user/actions';
import { getUserId } from '@/shared/processing';
import React, { memo, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SettingLanguagesApp from './SettingLanguagesApp';
import IconGrayAppLanguagesSVG from '@/components/SVG/IconGrayAppLanguagesSVG';

const SettingAppLanguageContainer = (): ReactElement => {
  const dispatch = useDispatch();
  const appLocale = useSelector((state: RootState) => {
    return state.app.locale;
  });
  const [languagesDialogVisible, setLanguagesDialogVisible] = useState(false);
  return (
    <>
      <CustomItemSetting
        title={language('language')}
        content={language(`locale.${appLocale}`)}
        onPress={() => setLanguagesDialogVisible(true)}
        image={<IconGrayAppLanguagesSVG />}
      />
      <SettingLanguagesApp
        isVisible={languagesDialogVisible}
        topTitle={language('language')}
        bottomTitle={language('save')}
        languageSelected={appLocale}
        onBackdropPress={() => {
          setLanguagesDialogVisible(false);
        }}
        confirmOnPressedCallback={locale => {
          setLanguagesDialogVisible(false);
          changeLocaleLocal(locale);
          dispatch(changeLocale(locale));
          dispatch(updateAppLanguage({ appLanguage: locale, userId: getUserId() }));
        }}
      />
    </>
  );
};

export default memo(SettingAppLanguageContainer);
