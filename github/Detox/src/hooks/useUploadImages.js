import {useApolloClient} from '@apollo/client';
import {useContext, useState} from 'react';
import OpenAppSettings from 'react-native-app-settings';
import {useSelector} from 'react-redux';

import {handleUnAuthorizedRequest} from '../api/authApi';
import {useApiCall} from '../api/restful/useApiCall';
import {uploadImages} from '../api/userApi/uploadApi';
import {AppContext} from '../appData/appContext/appContext';
import {getUserId} from '../appData/user/selectors';
import {MAX_LENGTH} from '../assets/constants';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import {STRINGS} from '../assets/localize/string';
import {getImageSource} from '../utils/fileHandler';
import {
  checkImageExtension,
  editImageItemFromArray,
  IMAGE_START_INDEX,
  mapToUiImageSelectionSources,
  mapToUploadedImages,
  validateUpdateImages,
} from '../utils/ImageUtil';

type Image = {
  id: Number,
  url: String,
  checked: Boolean,
  name: String,
  size: Number,
  type: String,
  lastModified: Number,
};

type UploadImagesOutput = {
  imageURLs: Array<Image>,
  onNoPermission: Function,
  onWrongMime: Function,
  onSetImages: Function,
  onDeleteImage: (sortedImages, image) => {},
  onSelectedImages: (selectedImages, editingImageId) => {},
  onSelectSingleImage: Function,
};

const DEFAULT_EDITING_ID = -1;
const DEFAULT_SELECTED_ID = 0;

const initState = {
  images: [],
  editingId: DEFAULT_EDITING_ID,
  singleSelectedImageId: DEFAULT_SELECTED_ID,
};

export const useUploadImages = props => {
  const {enableSelection = false, defaultImages, maxFiles, maxSizeInMB} = props ?? {};
  const maxValidFiles = maxFiles ?? MAX_LENGTH.DOCUMENT_IMAGES;
  const maxSizePerDocument = maxSizeInMB ?? MAX_LENGTH.FILE_SIZE;

  const {showAppSpinner, showErrorAlert, showAppModal} = useContext(AppContext);
  const client = useApolloClient();

  const [state, setState] = useState({
    ...initState,
    images: mapToUiImageSelectionSources({images: defaultImages ?? []}),
  });

  const userId = useSelector(getUserId);

  const onUploadError = error => {
    showAppSpinner(false);
    const isErrorUnauthorized = error?.messageCode === Message.UNAUTHOR_ERROR;
    const onOkHandler = isErrorUnauthorized ? handleUnAuthorizedRequest : () => {};

    setState({...state, editingId: DEFAULT_EDITING_ID});
    showErrorAlert(error?.message, onOkHandler);
  };

  const onUploadSuccess = data => {
    showAppSpinner(false);
    const uploadedImages = mapToUploadedImages({
      uploadedPhotos: data,
      lastItemId:
        state.images?.length > 0
          ? state.images[state.images.length - 1]?.id
          : IMAGE_START_INDEX - 1,
      enableSelection: enableSelection ?? false,
    });
    let newImages;
    if (state.editingId !== DEFAULT_EDITING_ID) {
      newImages = editImageItemFromArray(state.editingId, uploadedImages[0], state.images);
    } else {
      newImages = [...state.images, ...uploadedImages];
    }
    setState({...state, images: newImages, editingId: DEFAULT_EDITING_ID});
  };

  const {startApi: startUpload} = useApiCall({onError: onUploadError, onSuccess: onUploadSuccess});

  const startUploadImages = selectedImages => {
    showAppSpinner(true);
    startUpload(async () => {
      const photoSources = selectedImages.map(e => ({
        ...e,
        ...getImageSource(e.path ?? e.uri ?? e.sourceURL),
      }));
      const response = await uploadImages({
        client,
        userId,
        photoSources,
        responseUri: true,
      });
      return response;
    });
  };

  const linkToSetting = () => OpenAppSettings.open();

  const onNoPermission = () => {
    showAppModal({
      isVisible: true,
      message: translate(STRINGS.CAMERA_FORBIDDEN),
      cancelText: translate(STRINGS.CLOSE),
      onOkHandler: linkToSetting,
    });
  };

  const onWrongMime = () => {
    showErrorAlert(
      translate('common.uploadImagesPolicy', {
        fileSize: maxSizePerDocument,
        size: maxValidFiles,
      }),
    );
  };

  const onSelectedImages = (imageSources, _editingId) => {
    if (
      validateUpdateImages(
        state.images,
        imageSources,
        _editingId,
        DEFAULT_EDITING_ID,
        maxValidFiles,
        maxSizePerDocument * 1024 * 1024,
      )
    ) {
      showErrorAlert(
        translate('common.uploadImagesPolicy', {
          fileSize: maxSizePerDocument,
          size: maxValidFiles,
        }),
      );
      return;
    }
    setState({...state, editingId: _editingId});
    startUploadImages(imageSources);
  };

  const onDeleteImage = (sortedImages, item) => {
    const isDeletedSelectedImage = state.singleSelectedImageId === item.id;
    const files = state.images.filter(e => !checkImageExtension(e.uri || e.url));

    const newImages = mapToUiImageSelectionSources({
      images: sortedImages,
      selectedImageId: isDeletedSelectedImage ? IMAGE_START_INDEX : state.singleSelectedImageId,
    });
    setState({
      ...state,
      images: [...files, ...newImages],
      singleSelectedImageId: isDeletedSelectedImage
        ? IMAGE_START_INDEX
        : state.singleSelectedImageId,
    });
  };

  const onSelectSingleImage = imageId => {
    const newImages = mapToUiImageSelectionSources({
      images: state.images,
      selectedImageId: imageId,
    });
    setState({
      ...state,
      images: newImages,
      singleSelectedImageId: imageId,
    });
  };

  const onSetImages = images => {
    setState({...state, images});
  };

  const output: UploadImagesOutput = {
    imageURLs: state.images,
    seletedImageId: state.singleSelectedImageId,
    onDeleteImage,
    onSetImages,
    onSelectSingleImage,
    onSelectedImages,
    onNoPermission,
    onWrongMime,
  };

  return output;
};
