import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { appLocaleSelector } from '@/redux/app/selector';
import { setFilterGlobal } from '@/redux/filters/actions';
import { filterGlobalSelector } from '@/redux/filters/selector';
import ErrorDialog from '@/screens/DeletetAccount/ErrorDialog';
import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Global } from './Global';
import IconGrayDisoveryLanguagesSVG from '@/components/SVG/IconGrayDisoveryLanguagesSVG';

export function GlobalContainer() {
  appLocaleSelector();
  const dispatch = useDispatch();
  const global = filterGlobalSelector();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const globalOnSwitch = (flag: boolean) => {
    NavigationActionsService.showLoading();
    dispatch(
      setFilterGlobal(flag, {
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            setErrorMessage(error);
            setErrorDialogVisible(true);
          }, 400);
        },
      }),
    );
  };

  return (
    <>
      <Global
        title={language('settingsScreen.global')}
        description={language('goingGlobal')}
        image={<IconGrayDisoveryLanguagesSVG />}
        isEnabled={global}
        disabled={false}
        toggleSwitchCallBack={(flag: boolean) => globalOnSwitch(flag)}
      />
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={errorMessage}
        confirmOnPressed={() => {
          setErrorDialogVisible(false);
        }}
      />
    </>
  );
}

export default memo(GlobalContainer);
