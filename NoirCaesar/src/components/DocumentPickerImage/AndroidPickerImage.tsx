import React, { Component } from 'react';
import ReactNativePickerModule from 'react-native-picker-module';
import { DocumentPickerImageSourceTitle, DocumentSourceImageList, DocumentSourceVideoList } from './DocumentPickerType';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';
import translate from '@src/localize';
import DocumentPicker from 'react-native-document-picker';
import NavigationActionsService from '@src/navigation/navigation';

export interface PickerOptions {
  onCompleted: (imageResponse?: any, type?: any) => void;
  onDelete?: () => void;
  titlePopup?: string;
  isMulti?: boolean;
  isHasVideo?: boolean;
}

export default class AndroidPickerImage extends Component<PickerOptions, {}> {
  show = () => {
    this.pickerRef && this.pickerRef.show();
  };

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

  handleAllDocumentSourceResponse = async (value: string, index: number) => {
    const { isMulti = false } = this.props;
    let optionsGallery = {};
    switch (index) {
      case 0:
        optionsGallery = {
          mediaType: 'photo',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: isMulti,
        };
        this.launchCameraOrPhotos(optionsGallery, PERMISSIONS.ANDROID.CAMERA, true, DocumentPicker.types.plainText);
        break;
      case 1:
        optionsGallery = {
          mediaType: 'photo',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: isMulti,
          maxFiles: 20,
          compressImageQuality: 0.5
        };
        this.launchCameraOrPhotos(optionsGallery, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, false, DocumentPicker.types.images);
        break;
      case 2:
        optionsGallery = {
          mediaType: 'video',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: false,
        };
        this.launchCameraOrPhotos(optionsGallery, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, false, DocumentPicker.types.video);
        break;
    }
  };

  onGetRef = (e: any) => {
    this.pickerRef = e;
  };

  render() {
    return (
      <ReactNativePickerModule
        items={this.props.isHasVideo ? (DocumentSourceVideoList as any) : (DocumentSourceImageList as any)}
        title={this.props.titlePopup ? this.props.titlePopup : DocumentPickerImageSourceTitle}
        pickerRef={this.onGetRef}
        onValueChange={this.handleAllDocumentSourceResponse}
      />
    );
  }
}
