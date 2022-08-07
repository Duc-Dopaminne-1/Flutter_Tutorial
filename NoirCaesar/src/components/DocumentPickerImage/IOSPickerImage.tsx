import { Component } from 'react';
import { ActionSheetIOS } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { DocumentSourceImageListIOS, DocumentPickerImageSourceTitle, DocumentSourceImageListVideoIOS } from './DocumentPickerType';
import { PickerOptions } from './AndroidPickerImage';
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';
import translate from '@src/localize';
import DocumentPicker from 'react-native-document-picker';
import NavigationActionsService from '@src/navigation/navigation';

export default class IOSPickerImage extends Component<PickerOptions, {}> {
  shouldComponentUpdate() {
    return false;
  }

  show() {
    this.showDocumentSourcePicker();
  }

  grantedAction = (options: any, isOpenCamera: boolean, type: any) => {
    if (isOpenCamera) {
      ImagePicker.openCamera(options).then(images => {
        this.props.onCompleted(images, type);
      }).catch((error) => {
        setTimeout(() => {
          if (error && error.code != "E_PICKER_CANCELLED") {
            NavigationActionsService.showErrorPopup(error);
          }
        }, 500);
      });
    } else {
      ImagePicker.openPicker(options).then(images => {
        this.props.onCompleted(images, type);
      }).catch((error) => {
        setTimeout(() => {
          if (error && error.code != "E_PICKER_CANCELLED") {
            NavigationActionsService.showErrorPopup(error);
          }
        }, 500);
      });
    }
  };

  launchCameraOrPhotos = (options: any, permission: any, isOpenCamera = false, type: any) => {
    check(permission).then(result => {
      switch (result) {
        case 'unavailable':
          if (isOpenCamera) {
            NavigationActionsService.showCustomPopup({
              text: translate('alert.camera_unavailable_message'),
            });
          } else {
            NavigationActionsService.showCustomPopup({
              text: translate('alert.photo_unavailable_message'),
            });
          }
          break;
        case 'blocked':
          NavigationActionsService.showCustomPopup({
            text: isOpenCamera ? translate('alert.camera_access_denied_message') : translate('alert.photo_access_denied_message'),
            buttonRedTitle: translate('alert.ok'),
            buttonGrayTitle: translate('alert.settings'),
            onPressGrayButton: () => {
              NavigationActionsService.hideCustomPopup();
              openSettings().catch(() => console.warn('cannot open settings'));
            },
          });
          break;
        case 'denied':
          request(permission).then(result => {
            if (result === 'granted') {
              this.grantedAction(options, isOpenCamera, type);
            }
          });
          break;
        case 'granted':
          this.grantedAction(options, isOpenCamera, type);
          break;
      }
    });
  };

  showDocumentSourcePicker = () => {
    this.handleShowActionSheetWithAllOptions(
      this.props.isHasVideo ? DocumentSourceImageListVideoIOS : DocumentSourceImageListIOS,
      this.props.titlePopup ? this.props.titlePopup : DocumentPickerImageSourceTitle,
    );
  };

  handleShowActionSheetWithAllOptions = (options: string[], title?: string) => {
    const { isMulti = false } = this.props;
    let optionsPhotos = {};
    const hasVideoObject = this.props.isHasVideo
      ? {
        title: title,
        options: options,
        cancelButtonIndex: 3,
      }
      : {
        title: title,
        options: options,
        cancelButtonIndex: 2,
      };
    ActionSheetIOS.showActionSheetWithOptions(hasVideoObject, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          // Open Camera
          optionsPhotos = {
            mediaType: 'photo',
            quality: 0.6,
            skipBackup: true,
            forceJpg: true,
            multiple: isMulti,
          };
          this.launchCameraOrPhotos(optionsPhotos, PERMISSIONS.IOS.CAMERA, true, DocumentPicker.types.plainText);
          break;
        case 1:
          optionsPhotos = {
            mediaType: 'photo',
            quality: 0.6,
            skipBackup: true,
            forceJpg: true,
            multiple: isMulti,
            maxFiles: 20,
            compressImageQuality: 0.5
          };
          // Open Photos
          this.launchCameraOrPhotos(optionsPhotos, PERMISSIONS.IOS.PHOTO_LIBRARY, false, DocumentPicker.types.images);
          break;
        case 2:
          optionsPhotos = {
            mediaType: 'video',
            quality: 0.6,
            skipBackup: true,
            forceJpg: true,
            multiple: false,
          };
          // Open Video
          if (this.props.isHasVideo) {
            this.launchCameraOrPhotos(optionsPhotos, PERMISSIONS.IOS.PHOTO_LIBRARY, false, DocumentPicker.types.video);
          }
          break;
      }
    });
  };

  render() {
    return null;
  }
}
