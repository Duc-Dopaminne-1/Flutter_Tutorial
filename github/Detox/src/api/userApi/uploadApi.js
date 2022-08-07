import FormData from 'form-data';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {deleteFile, getUniqueUploadImageName} from '../../utils/fileHandler';
import {getAuthApiHeaders} from '..';
import {
  GetImageUploadUrlDocument,
  GetSecuredFileUploadUrlDocument,
} from '../graphql/generated/graphql';
import {parseResponseData} from '../restful/parseResponseData';
import {parseResponseError} from '../restful/parseResponseError';
import {createRestfulApi} from './commonHandlers';

const UPLOAD_TIMEOUT_DURATION = 60000; //60s for upload
const UPLOAD_API_CONFIGS = {timeout: UPLOAD_TIMEOUT_DURATION};

const endPoints = {
  uploadAvatar: '/uploader/personal/upload',
  uploadImages: '/uploader/property_posts/multiple-upload',
  uploadContactTradingContractImage: '/uploader/support_requests/upload',
};

const restfulApiInstance = createRestfulApi(UPLOAD_API_CONFIGS);

function uploadApiConfig(onProgress) {
  const apiConfig = {
    headers: {
      ...getAuthApiHeaders(),
    },
    onUploadProgress: onProgress,
  };
  return apiConfig;
}

const getImageBodyData = (photoSource, userId, uid) => {
  return {
    name: getUniqueUploadImageName(userId, uid),
    uri: getFilePathForUpload(photoSource.uri),
    type: 'image/jpeg', //very important!!
  };
};

const getFilePathForUpload = (filePath: String) => {
  return Platform.OS === 'android' ? filePath : filePath.replace('file://', '');
};

const createFormData = (photoSource, body, userId) => {
  const data = new FormData();
  const bodyData = getImageBodyData(photoSource, userId);
  data.append('body', bodyData);

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

async function uploadImage({
  userId,
  photoSource,
  body = {},
  onProgress = () => {},
  deleteSourceAfterUpload = true,
  isUploadAvatar = true,
}) {
  try {
    const endPoint = isUploadAvatar
      ? endPoints.uploadAvatar
      : endPoints.uploadContactTradingContractImage;
    const formData = createFormData(photoSource, body, userId);
    const apiConfig = uploadApiConfig(onProgress);

    const results = await restfulApiInstance.post(endPoint, formData, apiConfig);
    return parseResponseData(results);
  } catch (error) {
    return parseResponseError(error);
  } finally {
    //delete file after upload if needed
    if (deleteSourceAfterUpload) {
      await deleteFile(photoSource.uri);
    }
  }
}

// const createFormDataForArrayImages = (photoSources, body, userId) => {
//   const data = new FormData();

//   for (let index = 0; index < photoSources.length; ++index) {
//     const photoSource = photoSources[index];
//     const bodyDataItem = getImageBodyData(photoSource, userId);
//     data.append('body', bodyDataItem);
//   }

//   Object.keys(body).forEach(key => {
//     data.append(key, body[key]);
//   });

//   return data;
// };

/**
 * upload image to Azure Blob with Client
 * @param {*} photoSource photo from device
 * @param {*} userId userId logged in app
 * @param {*} client client interface to query upload
 * @param {*} responseUri URI of photo from device (support to identifier image)
 * @returns response upload data
 */
export const uploadImageToAzureBlob = (photoSource, userId, client, responseUri, uid) => {
  const file = getImageBodyData(photoSource, userId, uid);
  return uploadToAzureBlob({
    fileName: file.name,
    filePath: file.uri,
    client,
    query: GetImageUploadUrlDocument,
    uploadUrlResponseKey: 'getImageUploadUrl',
  });
};

export const uploadFileToAzureBlob = ({fileName, filePath, client}) => {
  return uploadToAzureBlob({
    fileName,
    filePath,
    client,
    query: GetSecuredFileUploadUrlDocument,
    uploadUrlResponseKey: 'getSecuredFileUploadUrl',
  });
};

export const uploadToAzureBlob = async ({
  fileName,
  filePath,
  client,
  query = GetImageUploadUrlDocument,
  uploadUrlResponseKey,
}) => {
  const response = await client.query({
    query,
    variables: {payload: {fileName: fileName}},
    fetchPolicy: 'no-cache',
  });

  if (response && response.data && response.data[uploadUrlResponseKey]) {
    const data: GetImageUploadUrlResponse = response.data[uploadUrlResponseKey];
    const responseAzueBlob = await RNFetchBlob.fetch(
      'PUT',
      `${data.fileUrl}${data.signatureKey}`,
      {
        'x-ms-blob-type': 'BlockBlob',
        'content-type': 'application/octet-stream',
        // 'x-ms-blob-content-type': file.type,
      },
      RNFetchBlob.wrap(filePath),
    );

    const responseStatus = responseAzueBlob?.respInfo?.status;
    if (responseStatus && responseStatus >= 200 && responseStatus < 400) {
      return {imageFullPath: data.fileUrl};
    }
  }

  throw response;
};

async function uploadImages({
  client,
  userId,
  photoSources,
  deleteSourceAfterUpload = true,
  responseUri = false, // response uri with URI from device
}) {
  if (!photoSources) {
    return parseResponseError(null);
  }
  try {
    const images = await Promise.all(
      photoSources.map(async (photoSource, index) => {
        const url = await uploadImageToAzureBlob(photoSource, userId, client, responseUri, index);
        return {...photoSource, ...url};
      }),
    );
    return {isSuccess: true, data: images};
  } catch (error) {
    const networkError = error.networkError;
    if (networkError && networkError.statusCode === 401) {
      return {
        isSuccess: false,
        data: {message: translate(Message.UNAUTHOR_ERROR), messageCode: Message.UNAUTHOR_ERROR},
      };
    }
    return parseResponseError(error);
  } finally {
    //delete file after upload if needed
    if (deleteSourceAfterUpload) {
      await deletePhotoSources(photoSources);
    }
  }
}

async function uploadSingleImage({client, userId, photoSource, deleteSourceAfterUpload = true}) {
  if (!photoSource) {
    return parseResponseError(null);
  }
  try {
    const image = await uploadImageToAzureBlob(photoSource, userId, client);
    return {isSuccess: true, data: image};
  } catch (error) {
    return parseResponseError(error);
  } finally {
    if (deleteSourceAfterUpload) {
      await deleteFile(photoSource.uri);
    }
  }
}

async function uploadSecuredFiles(files: [{name: String, path: String, ...other}], client) {
  try {
    const data = await Promise.all(
      files.map(async file => {
        const response = await uploadFileToAzureBlob({
          fileName: file.name,
          filePath: getFilePathForUpload(file.path),
          client,
        });
        return {
          ...file,
          securedUrl: response.imageFullPath,
        };
      }),
    );
    return {isSuccess: true, data};
  } catch (error) {
    return parseResponseError(error);
  }
}

export async function deletePhotoSources(photoSources) {
  for (let index = 0; index < photoSources.length; index++) {
    const photoSource = photoSources[index];
    await deleteFile(photoSource.uri);
  }
}

export {uploadImage, uploadImages, uploadSecuredFiles, uploadSingleImage};
