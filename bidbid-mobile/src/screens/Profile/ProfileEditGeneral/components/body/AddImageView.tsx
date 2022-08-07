import React, { useCallback, useRef } from 'react';
import { ViewStyle, ImageStyle, Alert, Pressable } from 'react-native';
import { images, colors } from '@/vars';
import { useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { language } from '@/i18n';
import { createPhoto, deletePhoto, changePhotoToAvatar, updatePhoto, updateProfilePicture } from '@/redux/user/actions';
import { createFormData } from '@/models/photo';
import { CROP_PROFILE_PICTURE_SCREEN, PROFILE_EDIT_VIEW_IMAGE } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import ImageBlurLoading from 'react-native-image-blur-loading';
import { onCheckPermissionIOS } from '@/shared/permission';
import { PERMISSIONS } from 'react-native-permissions';
import PlusSVG from '@/components/SVG/PlusSVG';

const CONTAINER: ViewStyle = {
  height: 120,
  width: 120,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1.5,
  borderRadius: 14,
  borderColor: colors.gray_400,
  backgroundColor: colors.gray_50,
  borderStyle: 'dashed',
  margin: 15,
};

const PHOTO_STYLE: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  resizeMode: 'center',
};

let isChangePicture = false;

function AddImageView({ photo }) {
  const options = [language('actionSheet.takePhoto'), language('actionSheet.chooseFromLibrary'), language('actionSheet.cancel')];
  const changePictureOptions = [
    language('actionSheet.setDefaultProfilePicture'),
    language('actionSheet.changePicture'),
    language('actionSheet.view'),
    language('actionSheet.delete'),
    language('cancel'),
  ];

  //Action Sheet
  const uploadPictureActionSheetRef: any = useRef(null);
  const chooosePictureActionRef: any = useRef(null);
  const changePictureActionRef: any = useRef(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const showUploadPictureActionSheet = () => {
    uploadPictureActionSheetRef.current.show();
  };

  const showChangePictureActionSheet = () => {
    changePictureActionRef.current.show();
  };

  const handleUploadProfilePicture = useCallback((item, uri) => {
    navigation.goBack();
    const profilePicture = {
      type: 'image/jpeg',
      uri,
      name: Math.random().toString() + '.jpg',
    } as any;
    const data = new FormData();
    data.append('file', profilePicture);
    dispatch(
      changePhotoToAvatar({
        photoId: item.id,
      }),
    );
    dispatch(updateProfilePicture(data));
  }, []);

  const handleSelectPicture = useCallback(item => {
    navigation.navigate(CROP_PROFILE_PICTURE_SCREEN, { imageUri: item.uri, callback: uri => handleUploadProfilePicture(item, uri) });
  }, []);

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    })
      .then(image => {
        const data = createFormData(image);
        if (isChangePicture) {
          isChangePicture = false;
          dispatch(updatePhoto(photo.id, { data: data }));
        } else {
          dispatch(
            createPhoto({
              data,
            }),
          );
        }
      })
      .catch(async _e => {
        await onCheckPermissionIOS(PERMISSIONS.IOS.CAMERA);
      });
  };

  const openGallery = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    })
      .then(image => {
        const data = createFormData(image);
        if (isChangePicture) {
          isChangePicture = false;
          dispatch(updatePhoto(photo.id, { data }));
        } else {
          dispatch(
            createPhoto({
              data,
            }),
          );
        }
      })
      .catch(async _e => {
        await onCheckPermissionIOS(PERMISSIONS.IOS.PHOTO_LIBRARY);
      });
  };

  const onPress = photo ? showChangePictureActionSheet : showUploadPictureActionSheet;

  const renderImage = () => {
    if (photo === null || photo === undefined || photo.toString().trim() == '') {
      return <PlusSVG />;
    } else {
      return <ImageBlurLoading withIndicator source={{ uri: photo.url }} style={PHOTO_STYLE} thumbnailSource={images.missing} />;
    }
  };

  const handleChoosePictureActionSheet = index => {
    switch (index) {
      case 0:
        openCamera();
        break;
      case 1:
        openGallery();
        break;
      default:
        break;
    }
  };

  const uploadPictuerActionSheet = index => {
    if (index === 0) {
      chooosePictureActionRef.current.show();
    }
  };

  const changePictureActionSheet = index => {
    switch (index) {
      case 0:
        // chooosePictureActionRef.current.show();
        handleSelectPicture({
          id: photo.id,
          uri: photo.url,
          type: photo.contentType,
        });
        break;
      case 1:
        showUploadPictureActionSheet();
        isChangePicture = true;
        break;
      case 2:
        navigation.navigate(PROFILE_EDIT_VIEW_IMAGE, { uri: photo.url });
        break;
      case 3:
        Alert.alert(
          language('alert.confirm'),
          language('alert.areYouWantToDelete'),
          [
            {
              text: language('alert.cancel'),
              onPress: () => undefined,
              style: 'cancel',
            },
            {
              text: language('alert.ok'),
              onPress: () => {
                dispatch(deletePhoto({ photoId: photo.id }));
              },
            },
          ],
          { cancelable: false },
        );
        break;
    }
  };
  const renderBorder = (): ViewStyle => {
    if (photo === null || photo === undefined || photo.toString().trim() == '')
      return {
        borderWidth: 0.8,
      };
    return {
      borderWidth: 0,
    };
  };

  return (
    <>
      <Pressable style={[CONTAINER, { ...renderBorder() }]} onPress={onPress}>
        {renderImage()}
      </Pressable>

      <ActionSheet
        ref={uploadPictureActionSheetRef}
        options={[language('actionSheet.uploadPicture'), language('actionSheet.cancel')]}
        cancelButtonIndex={1}
        onPress={uploadPictuerActionSheet}
      />
      <ActionSheet ref={chooosePictureActionRef} options={options} cancelButtonIndex={2} onPress={handleChoosePictureActionSheet} />

      <ActionSheet
        ref={changePictureActionRef}
        options={changePictureOptions}
        destructiveButtonIndex={3}
        cancelButtonIndex={4}
        onPress={changePictureActionSheet}
      />
    </>
  );
}

export default AddImageView;
