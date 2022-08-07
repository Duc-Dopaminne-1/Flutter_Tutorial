import IOSPicker from './IOSPicker';
import { Platform } from 'react-native';
import AndroidPicker from './AndroidPicker';
import { isAndroid } from '@src/utils';

let DocumentPickerCustom: any;

if (!isAndroid()) {
  DocumentPickerCustom = IOSPicker;
} else {
  DocumentPickerCustom = AndroidPicker;
}

export default DocumentPickerCustom;
