import IOSPickerImage from './IOSPickerImage';
import { Platform } from 'react-native';
import AndroidPickerImage from './AndroidPickerImage';
import { isAndroid } from '@src/utils';

let DocumentPickerImage: any;

if (!isAndroid()) {
  DocumentPickerImage = IOSPickerImage;
} else {
  DocumentPickerImage = AndroidPickerImage;
}

export default DocumentPickerImage;
