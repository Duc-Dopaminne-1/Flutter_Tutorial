import { openInStore } from '../store';
import { APP_VERSION, FORCE_UPDATE } from '@/constants/app';
import { alertForceUpdate, alertSoftUpdate } from '../alert';
import { language } from '@/i18n';
import { get, set } from '@/services/storage';
import { getVersion } from '../processing';
import { getSettingApp } from '@/redux/app/selector';

class AppVersion {
  onOpenStore = async (type: string) => {
    if (type === FORCE_UPDATE) {
      alertForceUpdate(language('app.forceUpdate'), language('app.contentForce'), this.onOpenStore);
    } else {
      alertSoftUpdate(language('app.softUpdate'), language('app.contentSoft'), this.onOpenStore, this.onPressCancel);
    }

    await openInStore();
  };

  onPressCancel = async () => {
    await set('IS_CANCEL_UPDATE', 'true');
  };

  checkVersion = async () => {
    const setting = getSettingApp();
    const appMinVersion = getVersion(setting?.APP_VERSION_MINIMUM || '');
    const appStoreVersion = getVersion(setting?.APP_VERSION_CURRENT || '');
    const appVersion = getVersion(APP_VERSION || '1.0.0');
    const isCancelUpdate = await get('IS_CANCEL_UPDATE');

    // force update
    if (appVersion < appMinVersion) {
      await set('IS_CANCEL_UPDATE', 'false');
      alertForceUpdate(language('app.forceUpdate'), language('app.contentForce'), this.onOpenStore);
      return;
    }

    // soft update
    if (appVersion < appStoreVersion && isCancelUpdate !== 'true') {
      alertSoftUpdate(language('app.softUpdate'), language('app.contentSoft'), this.onOpenStore, this.onPressCancel);
      return;
    }
  };
}

export const appVersion = new AppVersion();
