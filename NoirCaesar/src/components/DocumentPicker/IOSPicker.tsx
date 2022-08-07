import { Component } from 'react';
import { ActionSheetIOS } from 'react-native';
import { PickerOptions } from './AndroidPicker';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { DocumentSourceListIOS, DocumentPickerSourceTitle } from './DocumentPickerType';
import translate from '@src/localize';
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';
import NavigationActionsService from '@src/navigation/navigation';

export default class IOSPicker extends Component<PickerOptions, {}> {
  shouldComponentUpdate() {
    return false;
  }

  show() {
    this.showDocumentSourcePicker();
  }

  grantedAction = (options: any) => {
    ImagePicker.openPicker(options).then(images => {
      this.props.onCompleted(images, undefined, DocumentPicker.types.video);
    });
  };

  launchGallery = (options: any) => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
      switch (result) {
        case 'unavailable':
          NavigationActionsService.showCustomPopup({
            text: translate('alert.photo_unavailable_message'),
          });
          break;
        case 'blocked':
          NavigationActionsService.showCustomPopup({
            text: translate('alert.photo_access_denied_message'),
            buttonRedTitle: translate('alert.ok'),
            buttonGrayTitle: translate('alert.settings'),
            onPressGrayButton: () => {
              NavigationActionsService.hideCustomPopup();
              openSettings().catch(() => console.warn('cannot open settings'));
            },
          });
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

  showDocumentSourcePicker = () => {
    this.handleShowActionSheetWithAllOptions(DocumentSourceListIOS, DocumentPickerSourceTitle);
  };

  handleShowActionSheetWithAllOptions = (options: string[], title?: string) => {
    const optionsGallery = {
      mediaType: 'video',
      quality: 0.6,
    };
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: title,
        options: options,
        cancelButtonIndex: 3,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.pickDocument(DocumentPicker.types.pdf);
            break;
          case 1:
            this.launchGallery(optionsGallery);
            break;
          case 2:
            this.pickDocument(DocumentPicker.types.audio);
            break;
        }
      },
    );
  };

  pickDocument = async (type: any) => {
    // Pick a single file
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
        NavigationActionsService.showErrorPopup(err);
      }
    }
  };

  render() {
    return null;
  }
}
