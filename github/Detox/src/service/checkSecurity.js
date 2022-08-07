import JailMonkey from 'jail-monkey';

import logService from './logService';

const isSecuredBinary = async () => {
  // is this device JailBroken on iOS/Android?
  if (__DEV__) {
    return true; //android emulator need this for develop
  }

  try {
    const isJailedBroken = await JailMonkey.isJailBroken();
    if (isJailedBroken) {
      logService.log('is jailed broken device');
      return false;
    }
  } catch (error) {
    logService.log('is jailed broken device error', error);
  }

  logService.log('is Secured Environment to run app===');

  return true;
};

export {isSecuredBinary};
