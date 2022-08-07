import IOSPicker from './IOSPicker';
import { Platform } from 'react-native';
import AndroidPicker from './AndroidPicker';

export enum MimeType {
  audio = 'audio/*',
  pdf = 'application/pdf',
  video = 'video/*',
  images = 'image/*',
}

let DocumentPickerCustom: any;

if (Platform.OS === 'ios') {
  DocumentPickerCustom = IOSPicker;
} else {
  DocumentPickerCustom = AndroidPicker;
}

export default DocumentPickerCustom;
