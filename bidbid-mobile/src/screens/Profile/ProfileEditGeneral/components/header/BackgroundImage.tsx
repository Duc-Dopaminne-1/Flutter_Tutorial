import React, { useState, useRef, useCallback } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { images, screenWidth } from '@/vars';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import ActionSheet from 'react-native-actionsheet';
import { language } from '@/i18n';
import { useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { createPhoto, updatePhoto, updateProfilePicture } from '@/redux/user/actions';
import { useNavigation } from '@react-navigation/native';
import { CROP_PROFILE_PICTURE_SCREEN, PROFILE_EDIT_VIEW_IMAGE } from '@/navigation/screenKeys';
import { createFormData } from '@/models/photo';

function BackgroundImage() {
  let isChangePicture = false;
  const { avatar } = useSelector((state: UserInit) => state.user.data);
  const changePictureActionRef: any = useRef(null);
  const choosePictureActionRef: any = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isImageError, setIsImageError] = useState(false);

  const chooseOptions = [language('actionSheet.takePhoto'), language('actionSheet.chooseFromLibrary'), language('cancel')];
  const changeOptions = [language('changeProfilePicture'), language('editProfilePicture'), language('view'), language('cancel')];

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

  const handleChangePictureActionSheet = index => {
    switch (index) {
      case 0:
        isChangePicture = true;
        choosePictureActionRef.current.show();
        break;
      case 1:
        handleSelectPicture({
          uri: avatar.url,
          type: avatar.type,
        });
        break;
      case 2:
        navigation.navigate(PROFILE_EDIT_VIEW_IMAGE, { uri: avatar.url });
        break;

      default:
        break;
    }
  };

  const handleUploadProfilePicture = useCallback((_item, uri) => {
    navigation.goBack();
    const profilePicture = {
      type: 'image/jpeg',
      uri,
      name: Math.random().toString() + '.jpg',
    } as any;
    const data = new FormData();
    data.append('file', profilePicture);
    dispatch(updateProfilePicture(data));
  }, []);

  const handleSelectPicture = useCallback(item => {
    navigation.navigate(CROP_PROFILE_PICTURE_SCREEN, { imageUri: item.uri, callback: uri => handleUploadProfilePicture(item, uri) });
  }, []);

  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    }).then(image => {
      const data = createFormData(image);
      if (isChangePicture) {
        isChangePicture = false;
        dispatch(updatePhoto(avatar.id, { data: data }));
        handleSelectPicture({
          uri: image.path,
          type: image.mime,
        });
      } else {
        dispatch(
          createPhoto({
            data,
          }),
        );
      }
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    }).then(image => {
      const data = createFormData(image);
      if (isChangePicture) {
        isChangePicture = false;
        dispatch(updatePhoto(avatar.id, { data: data }));
        handleSelectPicture({
          uri: image.path,
          type: image.mime,
        });
      } else {
        dispatch(
          createPhoto({
            data,
          }),
        );
      }
    });
  };

  if (isImageError || avatar === null || avatar === undefined) {
    return (
      <>
        <Pressable onPress={() => choosePictureActionRef.current.show()}>
          <Image source={images.missing} style={styles.image} />
        </Pressable>
        <ActionSheet ref={choosePictureActionRef} options={chooseOptions} cancelButtonIndex={2} onPress={handleChoosePictureActionSheet} />
      </>
    );
  }

  const onLoadImageError = () => {
    setIsImageError(true);
  };

  const changePictureAction = () => {
    changePictureActionRef.current.show();
  };

  return (
    <>
      <Pressable onPress={changePictureAction} style={styles.imageContainer}>
        <Image source={{ uri: avatar.url ? avatar.url : '' }} resizeMode={'cover'} style={styles.image} onError={onLoadImageError} />
      </Pressable>
      <ActionSheet ref={changePictureActionRef} options={changeOptions} cancelButtonIndex={3} onPress={handleChangePictureActionSheet} />
      <ActionSheet ref={choosePictureActionRef} options={chooseOptions} cancelButtonIndex={2} onPress={handleChoosePictureActionSheet} />
    </>
  );
}

export default React.memo(BackgroundImage);

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: 380,
    width: screenWidth,
    borderRadius: 10,
  },
});
