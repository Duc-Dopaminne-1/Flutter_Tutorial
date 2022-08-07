
export interface FileUploadModel {
  uri: string,
  type?: string,
  name?: string
}
export interface ImageUploadModel {
  file: FileUploadModel,
  isUploaded?: boolean
}

export interface ObservebleImageModel {
  url?: string[],
  completed?: boolean
}

export const createFormData = (file: FileUploadModel) => {
  const formData = new FormData();
  formData.append("folder_name", 'media/photos');
  formData.append('file', file);
  return formData;
};
