import findIndex from 'lodash/findIndex';

const mapImagesUrisToUI = (imageUris, startIndex) => {
  if (!imageUris || imageUris?.length === 0 || !Array.isArray(imageUris)) {
    return [];
  }
  let itemId = startIndex;
  return imageUris.map(e => {
    return {id: itemId++, uri: e, url: e};
  });
};

const mapEditedImageToArrayImages = (id, editedImage, images) => {
  if (!images || !images.length) {
    return [];
  }

  if (!editedImage) {
    return [...images];
  }

  const newArr = [...images];
  const index = findIndex(images, {id});
  if (index !== -1) {
    newArr[index].uri = editedImage.uri;
  }

  return newArr;
};

const ImagePickerUtils = {
  mapImagesUrisToUI,
  mapEditedImageToArrayImages,
};

export default ImagePickerUtils;
