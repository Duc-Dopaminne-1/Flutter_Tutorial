import { ActionCallback } from '@/redux/auth';
import { Image } from 'react-native-image-crop-picker';

export interface PHOTO {
  id: number;
  url?: string;
  key: string;
  contentType: string;
  size: number;
  type: string;
  order: number;
  isVerified: boolean;
  createdAt?: string;
  updateAt?: string;
  deletedAt?: any;
}

export interface CREATE_PHOTO {
  type: number | string;
  uri?: string;
  name: string;
}

export interface PHOTO_CREATE_PAYLOAD extends ActionCallback {
  data: any;
}

export interface PHOTO_UPDATE_PAYLOAD extends ActionCallback {
  data: any;
}

export interface VERIFY_USER_PHOTO_PAYLOAD extends ActionCallback {
  data: any;
}

export interface PHOTO_DELETE_PAYLOAD extends ActionCallback {
  photoId: number;
}

export const createFormData = (image: Image, type?: string, order?: string): FormData => {
  const formData = new FormData();
  const name = 'image.jpg';
  formData.append('type', type || 'avatar');
  formData.append('order', order || '1');
  const avatar: any = {
    type: image.mime,
    uri: image.path,
    name: name,
  };
  formData.append('file', avatar);
  return formData;
};
