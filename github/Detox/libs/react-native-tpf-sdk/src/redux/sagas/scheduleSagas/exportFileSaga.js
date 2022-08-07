import { call, put } from 'redux-saga/effects';
import RNFetchBlob from 'rn-fetch-blob';
import { exportFile } from '../../../services/api/scheduleApi';
import { exportFileSuccess } from '../../actions/schedule';
import showToast from '../../../helpers/showToast';
import { Platform } from 'react-native';
import { requestPermissionAndroid } from '../../../helpers/device';

export function* exportFileSaga(obj) {
  const params = obj.payload;
  try {
    const data = yield call(exportFile, params);
    if (data?.status === 200) {
      const url = data?.data?.result?.url;
      showToast();
      const date = new Date();
      const { config, fs } = RNFetchBlob;
      let downloadFolder = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
      const fileName = `${Math.floor(date.getTime() + date.getSeconds() / 2)}.pdf`;
      let downloadPath = downloadFolder + '/' + fileName;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          // Show notification when response data transmitted
          notification: true,
          // Make the file scannable  by media scanner
          mediaScannable: true,
          path: downloadPath
        },
        path: downloadPath // this is the path where your downloaded file will live in
      };

      if (Platform.OS === 'android') {
        const result = yield requestPermissionAndroid();
        if (result) {
          config(options)
            .fetch('GET', url)
            .then(res => {
              RNFetchBlob.android.actionViewIntent(res.path(), 'application/pdf');
            })
            .catch(err => {});
        }
      } else {
        config(options)
          .fetch('GET', url)
          .then(res => {
            RNFetchBlob.ios.openDocument(res.path());
          })
          .catch(err => {});
      }
      yield put(exportFileSuccess());
    }
  } catch (error) {
    yield put(exportFileSuccess());
  }
}
