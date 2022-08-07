import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import {Dimensions, NativeModules, Platform} from 'react-native';

import {IMAGE_EXTENSION, IMAGE_MIME} from '../assets/constants';
import {normal} from '../assets/theme/metric';
import {Document} from '../hooks/useUploadDocument';
import {getLastPathComponent} from './fileHandler';
import NumberUtils from './NumberUtils';

const {StatusBarManager} = NativeModules;

const IMAGE_MIN_WIDTH = 320;
const DEFAULT_IMAGE_MARGIN = normal * 2;
const IMAGE_START_INDEX = 0;

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 32 : StatusBarManager.HEIGHT;

export const IMAGE_SIZES = {
  SMALL: 0,
  MEDIUM: 1,
  LARGE: 2,
};

export const SCREEN_SIZE = {
  WIDTH: Dimensions.get('screen').width,
  HEIGHT: Dimensions.get('screen').height,
};

export const IMAGE_RATIO = {
  R16x9: 16 / 9,
  R4x3: 4 / 3,
  R1x1: 1,
  R1x2: 1 / 1.4,
  R2x4: 2 / 4,
  R2x1: 2 / 1,
};

export const getImageSize = (width, ratio) => {
  return {
    WIDTH: width,
    HEIGHT: width / ratio,
  };
};

export const getFullSizeImageDimension = () => {
  const width = SCREEN_SIZE.WIDTH - DEFAULT_IMAGE_MARGIN;
  const height = width / IMAGE_RATIO.R16x9;
  return {
    width: width,
    height: height,
  };
};

export const getHeightImageDimension = (min = 5, ratio = IMAGE_RATIO.R16x9) => {
  const fullWidth = SCREEN_SIZE.WIDTH - DEFAULT_IMAGE_MARGIN;
  const width = Math.min((fullWidth * min) / 6, IMAGE_MIN_WIDTH);
  const height = width / ratio;
  return {width, height};
};

export const getSmallSizeImageDimension = () => {
  return getHeightImageDimension(5, IMAGE_RATIO.R2x1);
};

export const getCourseHeightDimension = () => {
  return getHeightImageDimension(3, IMAGE_RATIO.R1x2);
};

export const checkMime = image => {
  return (
    image.mime === IMAGE_MIME.JPEG ||
    image.mime === IMAGE_MIME.PNG ||
    image.mime === IMAGE_MIME.JPG ||
    image.type === IMAGE_MIME.JPEG ||
    image.type === IMAGE_MIME.PNG ||
    image.type === IMAGE_MIME.JPG
  );
};

export const checkSize = (image, maxSize) => {
  return image <= maxSize;
};

export const checkImageExtension = (filePath: string) => {
  if (isEmpty(filePath)) return false;
  let extFile = filePath.split('.').pop();
  if (!isEmpty(extFile)) {
    extFile = extFile.trim().toLowerCase();
    if (IMAGE_EXTENSION.some(e => e === extFile)) {
      return true;
    }
  }
  return false;
};

export const sortImagesWithAvatar = (a, b) => {
  if (a && b) {
    if (a?.checked || a?.avatar) {
      return -1;
    } else if (b?.checked || b?.avatar) {
      return 1;
    } else {
      return 0;
    }
  }
  return 0;
};

export const getImageBySizeFromServer = (
  imageSource: string,
  imageSize = 0,
  defaultImage = '',
): string => {
  if (!imageSource) return defaultImage;
  try {
    const images = JSON.parse(imageSource);
    return images?.[imageSize]?.images?.[0]?.url ?? defaultImage;
  } catch {
    return defaultImage;
  }
};

export const getMapImagesForFullscreenView = images => {
  if (!images) {
    return [];
  }
  return images?.map(item => {
    return {uri: item.url || item.uri};
  });
};

const mapToUiImageSelectionSources = ({
  images,
  lastItemId = IMAGE_START_INDEX - 1,
  selectedImageId,
  isSortable = false,
}) => {
  if (!images || !images?.length) {
    return []; //no images
  }

  let nextItemId = lastItemId + 1;
  if (typeof images === 'string') {
    images = JSON.parse(images);
  }

  if (!Array.isArray(images)) {
    return []; //no images
  }

  if (isSortable) {
    const sortedImages = images.sort(sortImagesWithAvatar);
    const imageResults = sortedImages?.map(
      ({url, uri, avatar, checked, name, size, type, lastModified}) => {
        const imageName = name ?? `Unknown${nextItemId}`;

        return {
          id: nextItemId++,
          url: url || uri,
          checked: avatar ?? checked ?? false,
          name: imageName,
          size: size ?? 0,
          type: type ?? IMAGE_MIME.JPEG,
          lastModified: lastModified ?? new Date().getTime(),
          uid: imageName + `_${nextItemId}`,
        };
      },
    );

    return imageResults;
  }

  return images?.map(({url, uri, avatar, name, size, type, lastModified}) => {
    const isSelectedId =
      avatar ||
      selectedImageId === nextItemId ||
      (!selectedImageId && !avatar && nextItemId === IMAGE_START_INDEX);
    const imageName = name ?? `Unknown${nextItemId}`;

    return {
      id: nextItemId++,
      url: url || uri,
      checked: isSelectedId,
      name: imageName,
      size: size ?? 0,
      type: type ?? IMAGE_MIME.JPEG,
      lastModified: lastModified ?? new Date().getTime(),
      uid: imageName + `_${nextItemId}`,
    };
  });
};

const mapToImageSourcesUI = ({images, lastItemId = IMAGE_START_INDEX - 1}) => {
  if (!images || !images?.length) {
    return []; //no images
  }

  let nextItemId = lastItemId + 1;
  if (typeof images === 'string') {
    images = JSON.parse(images);
  }

  if (!Array.isArray(images)) {
    return []; //no images
  }

  return images?.map(({url, uri, name, size, type, lastModified}) => {
    const imageName = name ?? `Unknown${nextItemId}`;
    return {
      id: nextItemId++,
      url: url || uri,
      name: imageName,
      size: size ?? 0,
      type: type ?? IMAGE_MIME.JPEG,
      lastModified: lastModified ?? new Date().getTime(),
      uid: imageName + `_${nextItemId}`,
    };
  });
};

/**
 * map to image sources
 * @param {*} images images source with information detail
 * @param {*} lastItemId last index item id
 * @returns List images with format {name: string(required), size: long(required), type: string (required), lastModified: long(required), url: string(required), avatar: bool(optional)}
 */
function mapToImageSourcesStructure({images, lastItemId = IMAGE_START_INDEX - 1}) {
  if (!images || !images?.length) {
    return []; //no images
  }

  let nextItemId = lastItemId + 1;
  if (typeof images === 'string') {
    images = JSON.parse(images);
  }

  if (!Array.isArray(images)) {
    return []; //no images
  }
  return images?.map(
    ({
      url,
      uri,
      path,
      filename,
      size,
      type,
      mime,
      lastModified,
      modificationDate,
      creationDate,
      fileSize,
      sourceURL,
    }) => {
      const imageName = isEmpty(filename)
        ? getLastPathComponent(url ?? uri ?? path ?? sourceURL)
        : filename;
      return {
        id: nextItemId++,
        url: url ?? uri ?? path ?? sourceURL,
        // on Android, can not get filename
        name: imageName,
        size: size ?? fileSize ?? 0,
        type: type ?? mime ?? IMAGE_MIME.JPEG,
        lastModified: NumberUtils.parseIntValue(lastModified ?? modificationDate ?? creationDate),
        uid: imageName + `_${nextItemId}`,
      };
    },
  );
}

const mapToDataImages = mapImages => {
  if (!mapImages || !mapImages.length) {
    return []; //no images
  }

  return mapImages.map(item => {
    return {url: item.uri};
  });
};

const removeImageItemFromArray = (item, array) => {
  if (!array || !array.length) {
    return []; //no item
  }

  if (!item) {
    return [...array];
  }

  const newArr = [...array];
  const index = findIndex(array, {id: item.id});
  if (index !== -1) {
    //only remove if found image
    newArr.splice(index, 1);
  }

  return newArr;
};

const editImageItemFromArray = (id, item, array) => {
  if (!array || !array.length) {
    return [];
  }

  if (!item) {
    return [...array];
  }

  const newArr = [...array];
  const index = findIndex(array, {id});
  if (index !== -1) {
    newArr[index].uri = item.uri;
    newArr[index].url = item.url;
  }

  return newArr;
};

const validateUpdateImages = (
  images,
  selectedImages,
  editingId = -1,
  defaultEditingId = -1,
  limitNumberImages = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB
) => {
  let validateNumber = images?.length + selectedImages?.length > limitNumberImages; // Subtract add image
  if (editingId !== defaultEditingId) {
    validateNumber = images.length > limitNumberImages; // Subtract add image
  }
  let isOverFileSize = false;
  let isWrongMime = false;
  selectedImages.forEach(element => {
    if (
      (element.size && element.size > maxFileSize) ||
      (element.fileSize && element.fileSize > maxFileSize)
    ) {
      isOverFileSize = true;
    }
    if (element.mime && !checkMime(element)) {
      isWrongMime = true;
    }
  });
  return validateNumber || isOverFileSize || isWrongMime;
};

const validateFile = (
  file: Document,
  maxFileSize = 5 * 1024 * 1024, // 5MB
) => {
  let isOverFileSize = false;

  if (file.length > maxFileSize) {
    isOverFileSize = true;
  }

  const isValid = !isOverFileSize;
  return isValid;
};

const mapSourceFileToUpload = (uploadedFiles: Array<Document>) => {
  if (uploadedFiles && uploadedFiles.length > 0) {
    return uploadedFiles.map(e => ({
      name: e.name,
      url: e.securedUrl,
      size: e.length,
      type: e?.type || 'image/jpeg',
      lastModified: new Date().getTime(),
    }));
  }
  return uploadedFiles;
};

function mapToUploadedImages({
  uploadedPhotos,
  lastItemId,
  enableSelection = false,
}: {
  uploadedPhotos: Array<Object>,
  lastItemId: Number,
  enableSelection: Boolean,
}) {
  if (!uploadedPhotos || !uploadedPhotos?.length) {
    return []; //no images
  }

  if (typeof uploadedPhotos === 'string') {
    uploadedPhotos = JSON.parse(uploadedPhotos);
  }

  if (!Array.isArray(uploadedPhotos)) {
    return []; //no images
  }

  const urisUploaded = uploadedPhotos.map(e => ({...e, url: e.imageFullPath ?? ''}));

  let imagesUI = [];

  if (enableSelection) {
    imagesUI = mapToUiImageSelectionSources({images: urisUploaded, lastItemId});
  } else {
    imagesUI = mapToImageSourcesUI({images: urisUploaded, lastItemId});
  }
  return imagesUI;
}
export const getRatio = (w, h) => {
  const result = 0;
  if (h === 0) {
    return result;
  }
  return parseFloat((w / h).toFixed(2));
};

const checkValidImageUrl = url => {
  const reUrl = RegExp(`(https?:\/\/.*\.(?:${IMAGE_EXTENSION.join('|')}))`, 'i');
  return !!reUrl.test(url);
};

export {
  checkValidImageUrl,
  editImageItemFromArray,
  IMAGE_START_INDEX,
  mapSourceFileToUpload,
  mapToDataImages,
  mapToImageSourcesStructure,
  mapToImageSourcesUI,
  mapToUiImageSelectionSources,
  mapToUploadedImages,
  removeImageItemFromArray,
  validateFile,
  validateUpdateImages,
};
