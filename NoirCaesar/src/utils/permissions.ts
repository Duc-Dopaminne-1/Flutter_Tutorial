import { PermissionsAndroid, Platform } from 'react-native';

const requestRecordAudioPermission = async () => {
  if (Platform.OS == 'ios') return true;
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      // PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  } catch (err) {
    console.warn(err);
  }
  // const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  // const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  const recordGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  if (!recordGranted) {
    console.log(recordGranted);
    console.log('Read and write permissions have not been granted');
    return false;
  }
  return true;
};

export { requestRecordAudioPermission };
