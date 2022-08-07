import { CustomSwitch } from '@/components/CustomSwitch';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { setFilterGlobal } from '@/redux/filters/actions';
import { filterGlobalSelector } from '@/redux/filters/selector';
import React, { memo, ReactElement, useEffect, useState } from 'react';

function FilterGlobalContainer(): ReactElement {
  const global = filterGlobalSelector();
  const [isOpen, setIsOpen] = useState(global);

  useEffect(() => {
    if (isOpen !== global) {
      setIsOpen(global);
    }
  }, [global]);

  const globalOnSwitch = (flag: boolean) => {
    setIsOpen(flag);
    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      setFilterGlobal(flag, {
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: _error => {
          NavigationActionsService.hideLoading();
        },
      }),
    );
  };

  return (
    <CustomSwitch title={language('settingsScreen.global')} isEnabled={isOpen} disabled={false} toggleSwitchCallBack={globalOnSwitch} />
  );
}

export default memo(FilterGlobalContainer);
