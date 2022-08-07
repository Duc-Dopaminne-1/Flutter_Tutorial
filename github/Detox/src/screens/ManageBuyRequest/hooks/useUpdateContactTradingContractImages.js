import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useApiCall} from '../../../api/restful/useApiCall';
import {uploadImage} from '../../../api/userApi/uploadApi';
import {getUserId} from '../../../appData/user/selectors';

const useUpdateContactTradingContractImages = ({
  onUploadInProgress = () => {},
  onDoneUpload = () => {},
  onErrorUpload = () => {},
}) => {
  const userId = useSelector(getUserId);
  const [uploadedImageUris, setUploadedImageUris] = useState([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState(0);
  const [imagesToBeUploaded, setImagesToBeUploaded] = useState([]);
  const StartUploadImage = selectedImages => {
    setUploadedImageUris([]);
    setImagesToBeUploaded(selectedImages);
  };
  const onUploadSuccess = data => {
    if (!data) {
      return;
    }
    const uploadedImageUrisTmp = uploadedImageUris;
    const uploadedUri = data.imageFullPath ?? null;
    if (uploadedUri) {
      uploadedImageUrisTmp.push(uploadedUri);
      setUploadedImageUris(uploadedImageUrisTmp);
    }
    if (uploadingImageIndex < imagesToBeUploaded.length - 1) {
      const nextIndex = uploadingImageIndex + 1;
      setUploadingImageIndex(nextIndex);
      return;
    }
    setImagesToBeUploaded([]);
    setUploadingImageIndex(0);
    onDoneUpload(uploadedImageUris);
  };
  const onUploadError = error => {
    onErrorUpload(error);
    setImagesToBeUploaded([]);
    setUploadingImageIndex(0);
  };
  const ApiHandler = {
    onError: onUploadError,
    onSuccess: onUploadSuccess,
  };
  const {startApi: startUploadImage} = useApiCall(ApiHandler);
  const UploadImageFunc = ({selectedImage, _userId, onUploadProgress}) => {
    const uploadImageCallback = async () => {
      const photoSource = selectedImage ?? {};
      const response = await uploadImage({
        userId: _userId,
        photoSource,
        onProgress: onUploadProgress,
        isUploadAvatar: false,
      });
      return response;
    };
    startUploadImage(uploadImageCallback);
  };
  const uploadNextPhoto = () => {
    if (uploadingImageIndex < imagesToBeUploaded.length && imagesToBeUploaded.length > 0) {
      UploadImageFunc({
        selectedImage: imagesToBeUploaded[uploadingImageIndex],
        _userId: userId,
        onUploadProgress: onUploadInProgress,
      });
    }
  };
  useEffect(uploadNextPhoto, [imagesToBeUploaded, uploadingImageIndex]);
  return [StartUploadImage];
};

export default useUpdateContactTradingContractImages;
