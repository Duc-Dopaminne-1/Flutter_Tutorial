import React, { Component } from 'react';
import ReactNativePickerModule from 'react-native-picker-module';
import { DocumentPickerImageSourceTitle, DocumentSourceImageList, DocumentSourceVideoList } from './DocumentPickerType';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';
import translate from '@src/localize';
import { Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export interface PickerOptions {
  onCompleted: (imageResponse?: any, type?: any) => void;
  onDelete?: () => void;
  titlePopup?: string;
  isMuti?: boolean;
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
      });
    } else {
      ImagePicker.openPicker(options).then(images => {
        this.props.onCompleted(images, type);
      });
    }
  };

  launchCameraOrPhotos = (options: any, permission: any, isOpenCamera = false, type: any) => {
    check(permission).then(result => {
      switch (result) {
        case 'unavailable':
          if (isOpenCamera) {
            Alert.alert(translate('alert.camera_unavailable_title'), translate('alert.camera_unavailable_message'));
          } else {
            Alert.alert(translate('alert.photo_unavailable_title'), translate('alert.photo_unavailable_message'));
          }
          break;
        case 'blocked':
          Alert.alert(
            isOpenCamera ? translate('alert.camera_access_denied_title') : translate('alert.photo_access_denied_title'),
            isOpenCamera ? translate('alert.camera_access_denied_message') : translate('alert.photo_access_denied_message'),
            [
              {
                text: translate('alert.ok'),
                onPress: () => {},
              },
              {
                style: 'cancel',
                text: translate('alert.settings'),
                onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
              },
            ],
          );
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
    const { isMuti = false } = this.props;
    let optionsGallery = {};
    switch (index) {
      case 0:
        optionsGallery = {
          mediaType: 'photo',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: isMuti,
        };
        this.launchCameraOrPhotos(optionsGallery, PERMISSIONS.ANDROID.CAMERA, true, DocumentPicker.types.plainText);
        break;
      case 1:
        optionsGallery = {
          mediaType: 'photo',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: isMuti,
        };
        this.launchCameraOrPhotos(optionsGallery, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, false, DocumentPicker.types.images);
        break;
      case 2:
        optionsGallery = {
          mediaType: 'video',
          quality: 0.6,
          skipBackup: true,
          forceJpg: true,
          multiple: isMuti,
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
