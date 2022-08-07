import CameraRoll from '@react-native-community/cameraroll';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';

import {getAuthApiHeaders} from '../api';
import {DEFAULT_AVATAR_FILE_NAME, DEFAULT_IMAGE_FILE_NAME} from '../assets/constants';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import Configs from '../configs';
import logService from '../service/logService';

const fileEndPoints = {
  GET_BOOKING_TEMPLATE: 'uploader/sale/booking-template',
  GET_DEPOSIT_TEMPLATE: 'uploader/sale/deposit-template',
};

function getLastPathComponent(path) {
  if (path == null || typeof path !== 'string') {
    return null;
  }

  //remove '/' at the end if needed
  const pathSeparator = '/';
  let lastComponent = path;
  const lastCharacter = path.substring(path.length - 1, 1);
  if (lastCharacter === pathSeparator) {
    lastComponent = lastComponent.substr(0, path.length - 2);
  }

  //
  const startIndex = path.lastIndexOf(pathSeparator) + 1;
  if (startIndex >= path.length) {
    return null;
  }

  lastComponent = lastComponent.substr(startIndex);
  return lastComponent;
}

function getUniqueUploadImageName(userId, uid = 0) {
  const time = new Date().getTime();
  return `${userId}-${time + uid}.jpg`;
}

function getAvatarSource(uri, userId) {
  let imageSource = IMAGES.IC_DEFAULT_AVATAR;
  if (uri) {
    const imageName = userId ? getUniqueUploadImageName(userId) : getLastPathComponent(uri);
    imageSource = {uri: uri, name: imageName || DEFAULT_AVATAR_FILE_NAME};
  }
  return imageSource;
}

function getImageSource(uri, userId) {
  let imageSource = IMAGES.IC_DEFAULT_AVATAR;
  if (uri) {
    const imageName = userId ? getUniqueUploadImageName(userId) : getLastPathComponent(uri);
    imageSource = {uri: uri, name: imageName || DEFAULT_IMAGE_FILE_NAME};
  }
  return imageSource;
}

async function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    const result = await RNFS.exists(filePath);
    if (result) {
      await RNFS.unlink(filePath);
    }
  } catch (error) {
    logService.log(error?.message);
  }
}

// TODO: add UI to handle download progress
const downloadFile = async ({
  fileName = 'fileName',
  fileExtension = 'pdf',
  endPoint = '',
  fileUrl = '',
}) => {
  const file = `${fileName}.${fileExtension}`;
  const mimeType = `application/${fileExtension}`;
  const dirss = RNFetchBlob.fs.dirs;
  const filePath = `${dirss.DocumentDir}/${file}`;
  const dirs = RNFetchBlob.fs.dirs;
  const {authorization} = getAuthApiHeaders();
  const url = fileUrl || `${Configs.rest.BASE_URL}/${endPoint}`;

  RNFetchBlob.config({
    fileCache: true,
    path: filePath,
    useDownloadManager: true,
    appendExt: fileExtension,
    addAndroidDownloads: {
      useDownloadManager: true,
      mime: mimeType,
      notification: true,
      mediaScannable: true,
      title: `${file}`,
      path: `${dirs.DownloadDir}/${file}`,
    },
  })
    .fetch('GET', url, {
      'Content-Type': mimeType,
      'Accept-Language': 'vi, vi-VN',
      Authorization: authorization,
    })
    .then(() => {
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.previewDocument(filePath);
      }
    })
    .catch(err => logService.log('download file error: ', err));
};

const downloadFileAzure = async (url, fileName) => {
  const fileExtension = fileName.split('.').pop();
  const mimeType = `application/${fileExtension}`;
  const file = `${fileName}.${fileExtension}`;
  const dirss = RNFetchBlob.fs.dirs;
  const filePath = `${dirss.DocumentDir}/${file}`;
  const dirs = RNFetchBlob.fs.dirs;

  RNFetchBlob.config({
    fileCache: true,
    path: filePath,
    useDownloadManager: true,
    appendExt: fileExtension,
    addAndroidDownloads: {
      useDownloadManager: true,
      mime: mimeType,
      notification: true,
      mediaScannable: true,
      title: fileName,
      path: `${dirs.DownloadDir}/${fileName}`,
    },
  })
    .fetch('GET', url, {})
    // eslint-disable-next-line sonarjs/no-identical-functions
    .then(() => {
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.previewDocument(filePath);
      }
    })
    .catch(err => logService.log('download file error: ', err));
};

const downloadImage = ({urlImage, onSuccess, onError}) => {
  RNFetchBlob.config({
    fileCache: true,
    appendExt: 'png',
    useDownloadManager: true,
  })
    .fetch('GET', urlImage)
    .then(res => {
      CameraRoll.save(res.data, {
        type: 'photo',
      });
      onSuccess ? onSuccess(res) : Toast.show(translate('common.saveImageSuccess'));
    })
    .catch(error => {
      onError ? onError(error) : Toast.show(translate('common.saveImageFail'));
      logService.log('Download image fail: ', error);
    });
};

export {
  deleteFile,
  downloadFile,
  downloadFileAzure,
  downloadImage,
  fileEndPoints,
  getAvatarSource,
  getImageSource,
  getLastPathComponent,
  getUniqueUploadImageName,
};
