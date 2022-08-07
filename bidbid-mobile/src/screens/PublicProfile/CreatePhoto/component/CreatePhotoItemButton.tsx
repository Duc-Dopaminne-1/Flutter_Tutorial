import React, { useContext, useRef, useState, memo } from 'react';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { language } from '@/i18n';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { CreatePhotoContext } from '@/screens/PublicProfile/CreatePhoto/CreatePhotoContext';
import { onCheckPermissionIOS } from '@/shared/permission';
import { PERMISSIONS } from 'react-native-permissions';
import PlusSVG from '@/components/SVG/PlusSVG';

interface CreatePhotoItemButtonProps {
  style: ViewStyle;
}
function CreatePhotoItemButton(props: CreatePhotoItemButtonProps) {
  const { style } = props;
  const [avatar, setAvatar] = useState('');
  const actionRef: any = useRef(null);
  const { onAddImage } = useContext(CreatePhotoContext);
  const options = [language('actionSheet.takePhoto'), language('actionSheet.chooseFromLibrary'), language('cancel')];

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    })
      .then(image => {
        const pathImage = image.path;
        setAvatar(pathImage);
        onAddImage(image);
      })
      .catch(async _e => {
        await onCheckPermissionIOS(PERMISSIONS.IOS.CAMERA);
      });
  };

  const handleEditAvatar = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 640,
      height: 640,
      cropping: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    })
      .then(image => {
        const pathImage = image.path;
        setAvatar(pathImage);
        onAddImage(image);
      })
      .catch(async _e => {
        await onCheckPermissionIOS(PERMISSIONS.IOS.PHOTO_LIBRARY);
      });
  };

  const handleActionSheet = index => {
    switch (index) {
      case 0:
        openCamera();
        break;
      case 1:
        handleEditAvatar();
        break;
      default:
        break;
    }
  };

  const handleUploadMedia = () => {
    actionRef.current.show();
  };

  return (
    <>
      <Pressable onPress={handleUploadMedia} style={style}>
        {avatar ? <Image source={{ uri: avatar }} resizeMode={'cover'} style={styles.icon} /> : <PlusSVG />}
      </Pressable>
      <ActionSheet ref={actionRef} title={language('selectAvatar')} options={options} cancelButtonIndex={2} onPress={handleActionSheet} />
    </>
  );
}

export default memo(CreatePhotoItemButton);

const styles = StyleSheet.create({
  icon: {
    height: '100%',
    width: '100%',
    borderRadius: 14,
  },
});
