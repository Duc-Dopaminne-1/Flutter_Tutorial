import OneSignal from 'react-native-onesignal';

import logService, {logNotification} from '../../service/logService';

function addExternalUserId(externalUserId) {
  logService.log('addExternalUserId ', externalUserId);
  if (!externalUserId) {
    return;
  }

  // Setting External User Id with Callback Available in SDK Version 3.7.0+
  OneSignal.setExternalUserId(externalUserId, results => {
    // The results will contain push and email success statuses
    logService.log('Results of setting external user id');
    logService.log(results);

    // Push can be expected in almost every situation with a success status, but
    // as a pre-caution its good to verify it exists
    if (results.push && results.push.success) {
      logService.log('Results of setting external user id push status:');
      logService.log(results.push.success);
    }

    // Verify the email is set or check that the results have an email success status
    if (results.email && results.email.success) {
      logService.log('Results of setting external user id email status:');
      logService.log(results.email.success);
    }
  });
}

function removeExternalUserId(externalUserId) {
  logService.log('removeExternalUserId ', externalUserId);
  if (!externalUserId) {
    return;
  }

  // Remove External User Id with Callback Available in SDK Version 3.7.0+
  OneSignal.removeExternalUserId(results => {
    // The results will contain push and email success statuses
    logService.log('Results of removing external user id');
    logService.log(results);
    // Push can be expected in almost every situation with a success status, but
    // as a pre-caution its good to verify it exists
    if (results.push && results.push.success) {
      logService.log('Results of removing external user id push status:');
      logService.log(results.push.success);
    }

    // Verify the email is set or check that the results have an email success status
    if (results.email && results.email.success) {
      logService.log('Results of removing external user id email status:');
      logService.log(results.email.success);
    }
  });
}

const getDeviceStateInfo = async () => {
  const deviceState = await OneSignal.getDeviceState();
  logNotification('deviceState', deviceState);
};

export {addExternalUserId, getDeviceStateInfo, removeExternalUserId};
