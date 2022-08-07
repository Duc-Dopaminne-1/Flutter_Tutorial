import {useApolloClient} from '@apollo/client';
import {useContext} from 'react';
import {Platform} from 'react-native';
import OpenAppSettings from 'react-native-app-settings';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {uploadSecuredFiles} from '../../api/userApi/uploadApi';
import {AppContext} from '../../appData/appContext/appContext';
import {
  CONSTANTS,
  MAX_LENGTH,
  NAVIGATION_ANIMATION_DURATION,
  PICKER_IMAGE,
} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import useUploadDocument from '../../hooks/useUploadDocument';
import {getImageSource} from '../../utils/fileHandler';
import {checkMime, getRatio} from '../../utils/ImageUtil';

export const useChatActions = ({onUploadImagesSuccess}) => {
  const {showAppSpinner, showAppModal, showErrorAlert} = useContext(AppContext);
  const client = useApolloClient();

  const {openDocument} = useUploadDocument();

  const openCamera = () => {
    chooseAction({id: PICKER_IMAGE.CAMERA});
  };

  const openGallery = () => {
    chooseAction({id: PICKER_IMAGE.GALLERY});
  };

  function chooseAction(action: {id: String}) {
    if (action.id === PICKER_IMAGE.CAMERA) {
      Promise.all([
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA),
      ]).then(([cameraStatus]) => {
        setTimeout(() => {
          onPermissionResult(action, cameraStatus);
        }, NAVIGATION_ANIMATION_DURATION * 2);
      });
    } else {
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          openGalleryAction();
        }, NAVIGATION_ANIMATION_DURATION * 2);
      } else {
        Promise.all([request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)]).then(
          ([readExternalStorageStatus]) => {
            setTimeout(() => {
              onPermissionResult(action, readExternalStorageStatus);
            }, NAVIGATION_ANIMATION_DURATION * 2);
          },
        );
      }
    }
  }

  const openCameraAction = () => {
    openAction(
      ImagePicker.openCamera({
        ...CONSTANTS.CAMERA_PICKER_OPTION,
        cropping: false,
      }),
    );
  };

  const openGalleryAction = () => {
    const sizeSelection = Platform.OS === 'ios' ? {maxFiles: MAX_LENGTH.DOCUMENT_FILES_CHAT} : null;
    openAction(
      ImagePicker.openPicker({
        ...CONSTANTS.GALLERY_PICKER_OPTION,
        multiple: true,
        ...sizeSelection,
      }),
    );
  };

  const openAction = action => {
    action
      .then(selectedImages => {
        if (!Array.isArray(selectedImages)) {
          selectedImages = [selectedImages];
        }
        let isCorrectMime = true;
        const arrayImageSource = selectedImages?.map(e => {
          if (!checkMime(e)) {
            isCorrectMime = false;
          }
          return e;
        });
        if (isCorrectMime) {
          setTimeout(() => {
            receiveImages(arrayImageSource);
          }, NAVIGATION_ANIMATION_DURATION * 2);
        } else {
          setTimeout(() => {
            onWrongMime();
          }, NAVIGATION_ANIMATION_DURATION * 2);
        }
      })
      .catch(error => {
        if (error.code === 'E_PERMISSION_MISSING') {
          setTimeout(() => {
            onNoPermission();
          }, NAVIGATION_ANIMATION_DURATION * 2);
        }
      });
  };

  const onPermissionResult = (action, result) => {
    switch (result) {
      case RESULTS.DENIED:
        break;
      case RESULTS.GRANTED:
        action.id === PICKER_IMAGE.CAMERA ? openCameraAction() : openGalleryAction();
        break;
      case RESULTS.BLOCKED:
        onNoPermission();
        break;
    }
  };

  const onNoPermission = () => {
    showAppModal({
      isVisible: true,
      message: translate(STRINGS.CAMERA_FORBIDDEN),
      cancelText: translate(STRINGS.CLOSE),
      onOkHandler: () => {
        OpenAppSettings.open();
      },
    });
  };

  const onWrongMime = () => {
    showErrorAlert(
      translate('common.uploadImagesPolicy', {
        fileSize: MAX_LENGTH.FILE_SIZE_CHAT,
        size: MAX_LENGTH.DOCUMENT_FILES_CHAT,
      }),
    );
  };

  const receiveImages = async (selectedImages: ImageOrVideo[]) => {
    if (selectedImages && selectedImages.length > 0) {
      const files = selectedImages.map(image => {
        const {name, uri} = getImageSource(image.path ?? image.sourceURL);
        return {
          name: name,
          path: uri,
          ratio: getRatio(image.width, image.height),
        };
      });
      showAppSpinner(true);
      const response = await uploadSecuredFiles(files, client);
      showAppSpinner(false);
      onUploadImagesSuccess(response.data);
    }
  };

  return {
    openDocument,
    openCamera,
    openGallery,
  };
};
