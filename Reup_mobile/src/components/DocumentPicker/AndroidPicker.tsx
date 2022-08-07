import React, { Component } from 'react';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import ReactNativePickerModule from 'react-native-picker-module';
import { DocumentSourceList, DocumentPickerSourceTitle } from './DocumentPickerType';
import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';
import translate from '@src/localize';
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';

export interface PickerOptions {
  onCompleted: (imageResponse?: any, documentResponse?: DocumentPickerResponse, docType?: any) => void;
  onDelete?: () => void;
}

export default class AndroidPicker extends Component<PickerOptions, {}> {
  show = () => {
    this.pickerRef && this.pickerRef.show();
  };

  grantedAction = (options: any) => {
    ImagePicker.openPicker(options).then(images => {
      this.props.onCompleted(images, undefined, DocumentPicker.types.video);
    });
  };

  launchGallery = (options: any) => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
      switch (result) {
        case 'unavailable':
          Alert.alert(translate('alert.photo_unavailable_title'), translate('alert.photo_unavailable_message'));
          break;
        case 'blocked':
          Alert.alert(translate('alert.photo_access_denied_title'), translate('alert.photo_access_denied_message'), [
            {
              text: translate('alert.ok'),
              onPress: () => {},
            },
            {
              style: 'cancel',
              text: translate('alert.settings'),
              onPress: () => openSettings().catch(() => console.warn('cannot open settings')),
            },
          ]);
          break;
        case 'denied':
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result === 'granted') {
              this.grantedAction(options);
            }
          });
          break;
        case 'granted':
          this.grantedAction(options);
          break;
      }
    });
  };

  handleAllDocumentSourceResponse = async (value: string, index: number) => {
    const optionsGallery = {
      mediaType: 'video',
      quality: 0.6,
    };
    switch (index) {
      case 0:
        // Pick a single file
        this.pickDocument(DocumentPicker.types.pdf);
        break;
      case 1:
        this.launchGallery(optionsGallery);
        break;
      case 2:
        // Pick a single file
        this.pickDocument(DocumentPicker.types.audio);
        break;
    }
  };

  pickDocument = async (type: any) => {
    try {
      const res = await DocumentPicker.pick({
        type: [type],
      });
      if (res.uri) {
        this.props.onCompleted(undefined, res, type);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        console.log(err && err);
        err && Alert.alert(translate('alert.title_error'), err.message);
      }
    }
  };

  onGetRef = (e: any) => {
    this.pickerRef = e;
  };

  render() {
    return (
      <ReactNativePickerModule
        items={DocumentSourceList}
        title={DocumentPickerSourceTitle}
        pickerRef={this.onGetRef}
        onValueChange={this.handleAllDocumentSourceResponse}
      />
    );
  }
}
