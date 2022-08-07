import React, {useEffect} from 'react';

import {MAX_LENGTH} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import ImagePicker from '../../../../../components/ImagePickerComponent';
import RequiredLabel from '../../../../../components/RequiredLabel';
import {useUploadImages} from '../../../../../hooks/useUploadImages';
import {
  checkImageExtension,
  mapSourceFileToUpload,
  validateFile,
} from '../../../../../utils/ImageUtil';

const limitNumberImages = MAX_LENGTH.contactTrading.limitTotalImages;

const UploadImagesComponent = ({
  buttonTitle = translate(STRINGS.PRESS_TO_UPLOAD_MORE),
  buttonUploadStyle,
  pickerTitle = translate(STRINGS.PICK_PICTURE),
  defaultImages,
  onImageChange = () => {},
  errorCode,
  isDisabled = false,
  isShowOnly = false,
  onPressImage,
  icon,
  hideCloseButton,
  titleStyle,
  title,
  enableUploadFiles,
}) => {
  const imagePickerHook = useUploadImages({
    maxFiles: MAX_LENGTH.contactTrading.maxSelectingImages,
    defaultImages,
  });

  const isMaxImageUpload = imagePickerHook.imageURLs.length >= limitNumberImages;

  const handleOnChangeImages = () => {
    if (imagePickerHook.imageURLs.length > 0) {
      onImageChange(imagePickerHook.imageURLs);
    }
  };
  useEffect(handleOnChangeImages, [imagePickerHook.imageURLs]);

  const onSelectedDocuments = documents => {
    if (
      documents &&
      documents.length > 0 &&
      !documents.map(e => validateFile(e)).find(e => e === false)
    ) {
      const mappedDocuments = mapSourceFileToUpload(documents);
      const newDocuments = [...(imagePickerHook.imageURLs ?? []), ...mappedDocuments];

      imagePickerHook.onSetImages(newDocuments);
    }
  };

  const onDeleteDocument = document => {
    const newDocuments = imagePickerHook.imageURLs?.filter(e => {
      const deletedDocumentUrl = document?.uri ?? document?.url;
      const tmpDocumentUrl = e?.uri ?? e?.url;
      return deletedDocumentUrl !== tmpDocumentUrl;
    });

    imagePickerHook.onSetImages(newDocuments);
  };

  const files =
    imagePickerHook.imageURLs?.length > 0
      ? imagePickerHook.imageURLs.filter(e => !checkImageExtension(e.url || e.uri))
      : [];

  const images =
    imagePickerHook.imageURLs?.length > 0
      ? imagePickerHook.imageURLs.filter(e => checkImageExtension(e.url || e.uri))
      : [];

  return (
    <>
      {!!title && <RequiredLabel title={title} titleStyle={titleStyle} isRequired={false} />}
      <ImagePicker
        documents={files}
        onDeleteDocument={onDeleteDocument}
        onUploadedDocuments={onSelectedDocuments}
        buttonUploadStyle={buttonUploadStyle}
        buttonTitleStyle={{color: COLORS.PRIMARY_A100}}
        defaultImages={images}
        numberImagePerRow={2}
        imageHeightRadio={0.6}
        onWrongMime={imagePickerHook.onWrongMime}
        errorCode={errorCode}
        buttonTitle={buttonTitle}
        icon={icon}
        pickerTitle={pickerTitle}
        isDisabled={isDisabled}
        isMaxImageUpload={isMaxImageUpload}
        isShowOnly={isShowOnly}
        hideCloseButton={hideCloseButton}
        onNoPermission={imagePickerHook.onNoPermission}
        onSelectedImages={imagePickerHook.onSelectedImages}
        onDeleteImage={imagePickerHook.onDeleteImage}
        onPressImage={onPressImage}
        maxFiles={MAX_LENGTH.contactTrading.maxSelectingImages}
        enableUploadFiles={enableUploadFiles}
      />
    </>
  );
};

export default UploadImagesComponent;
