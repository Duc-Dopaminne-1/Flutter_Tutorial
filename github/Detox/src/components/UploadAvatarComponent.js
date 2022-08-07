import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {
  CONSTANTS,
  MAX_LENGTH,
  NAVIGATION_ANIMATION_DURATION,
  PICKER_IMAGE,
} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {normal} from '../assets/theme/metric';
import {callAfterInteraction} from '../screens/commonHooks';
import {getAvatarSource} from '../utils/fileHandler';
import {checkMime, checkSize} from '../utils/ImageUtil';
import Avatar from './Avatar';
import ModalPicker from './Modal/ModalPicker';

const AVATAR_SIZE = 100;

const AvatarContainer = ({
  avatarSource,
  onPressIsVerifyProfilePhoto,
  isVerifyProfilePhoto,
  uploadAvatar,
  gender,
  isShowBtnAdd,
  containerStyle,
  size,
}) => {
  return (
    <Avatar
      isShowBtnAdd={isShowBtnAdd}
      gender={gender}
      onPress={uploadAvatar}
      onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
      isVerifyProfilePhoto={isVerifyProfilePhoto}
      url={avatarSource.uri}
      containerStyle={[containerStyle, {marginRight: normal}]}
      size={size}
    />
  );
};

const UploadAvatarComponent = ({
  imageSource,
  onAvatarSourceChange,
  onNoPermission,
  isVerifyProfilePhoto,
  onWrongMime,
  onPressIsVerifyProfilePhoto,
  containerStyle,
  gender,
  isShowBtnAdd,
  size = AVATAR_SIZE,
}) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const [avatarSource, setAvatarSource] = React.useState(imageSource);

  useEffect(() => {
    setAvatarSource(imageSource); // update avatar source image
  }, [imageSource]);
  const handlePermission = (cameraStatus, response) => {
    if (cameraStatus) {
      if (response?.uri) {
        const source = getAvatarSource(response.uri);
        setAvatarSource(source);
        onAvatarSourceChange(source);
      }
    } else {
      onNoPermission();
    }
  };
  const uploadAvatar = () => {
    setShowPicker(true);
  };

  const openCropper = image => {
    const {path} = image ?? {};

    ImagePicker.openCropper({
      ...CONSTANTS.GALLERY_PICKER_OPTION,
      cropping: true,
      path,
    })
      .then(selectedImage => {
        setTimeout(() => {
          handlePermission(RESULTS.GRANTED, {uri: selectedImage.path});
        }, NAVIGATION_ANIMATION_DURATION * 2);
      })
      .catch(() => {});
  };

  const openAction = (action, isCropper = false) => {
    action
      .then(selectedImage => {
        if (
          checkMime(selectedImage) &&
          checkSize(selectedImage.size, MAX_LENGTH.avatar.imageSize)
        ) {
          setTimeout(() => {
            if (isCropper) {
              openCropper(selectedImage);
            } else {
              handlePermission(RESULTS.GRANTED, {uri: selectedImage.path});
            }
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

  const openCamera = () => {
    openAction(ImagePicker.openCamera(CONSTANTS.CAMERA_PICKER_OPTION), false);
  };

  const openGallery = () => {
    openAction(ImagePicker.openPicker(CONSTANTS.GALLERY_PICKER_OPTION), true);
  };

  const onPermissionResult = (action, result) => {
    switch (result) {
      case RESULTS.DENIED:
        setShowPicker(false);
        break;
      case RESULTS.GRANTED:
        action.id === PICKER_IMAGE.CAMERA ? openCamera() : openGallery();
        break;
      case RESULTS.BLOCKED:
        setShowPicker(false);
        onNoPermission();
        break;
    }
  };

  const onChooseAction = action => {
    setShowPicker(false);
    callAfterInteraction(() => {
      handleActionType(action);
    });
  };

  function handleActionType(action) {
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
          openGallery();
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

  return (
    <>
      <AvatarContainer
        onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
        avatarSource={avatarSource}
        isVerifyProfilePhoto={isVerifyProfilePhoto}
        uploadAvatar={uploadAvatar}
        gender={gender}
        isShowBtnAdd={isShowBtnAdd}
        containerStyle={containerStyle}
        showPressIndicator
        size={size}
      />
      <ModalPicker
        cancelText={translate(STRINGS.CANCEL)}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        pickerTitle={translate(STRINGS.SELECT_AVATAR)}
        items={CONSTANTS.getImagePickerOptions()}
        onChooseAction={onChooseAction}
      />
    </>
  );
};

export default UploadAvatarComponent;
