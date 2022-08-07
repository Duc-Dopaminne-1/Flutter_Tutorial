import IOSPickerImage from './IOSPickerImage';
import { Platform } from 'react-native';
import AndroidPickerImage from './AndroidPickerImage';

let DocumentPickerImage: any;

if (Platform.OS === 'ios') {
  DocumentPickerImage = IOSPickerImage;
} else {
  DocumentPickerImage = AndroidPickerImage;
}

export default DocumentPickerImage;
