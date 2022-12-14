interface CustomButtonOptions {
  name?: string;
  title?: string;
}

interface StorageOptions {
  skipBackup?: boolean;
  path?: string;
  cameraRoll?: boolean;
  waitUntilSaved?: boolean;
}

export interface OptionsImagePicker {
  title?: string;
  cancelButtonTitle?: string;
  takePhotoButtonTitle?: string;
  chooseFromLibraryButtonTitle?: string;
  customButtons?: Array<CustomButtonOptions>;
  cameraType?: 'front' | 'back';
  mediaType?: 'photo' | 'video' | 'mixed';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  videoQuality?: 'low' | 'medium' | 'high';
  durationLimit?: number;
  rotation?: number;
  allowsEditing?: boolean;
  noData?: boolean;
  storageOptions?: StorageOptions;
}

export interface Avatar {
  uri: string;
  type?: string;
  fileName?: string;
}
