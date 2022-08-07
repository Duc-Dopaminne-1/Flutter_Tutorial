import { IError } from '@src/modules/base';
import { useDispatch } from 'react-redux';
import { uploadCollection } from '@src/modules/auth/actions';
import DocumentPicker from 'react-native-document-picker';
import { IURL } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/models';
import { PreSignedUrlParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/adapter/adapter';
import { Platform } from 'react-native';
import moment from 'moment';

export type Success = (data: IURL, type: any, index: number) => void;
export type Failure = (error?: IError) => void;
export type Progress = (index: number, percent: number) => void;
export type Start = ({
  imageResponse,
  index,
  type,
  success,
  failure,
  progress,
}: {
  imageResponse: any;
  index: number;
  type: any;
  success?: Success;
  failure?: Failure;
  progress?: Progress;
}) => void;

export const useUpload = (): [Start] => {
  const dispatch = useDispatch();

  const getFileImage = (imageResponse: any) => {
    let file = {};
    let uri = '';
    let typeCollection = '';
    let name = '';
    let size = 0;

    if (imageResponse) {
      if (Platform.OS === 'ios') {
        name =
          moment()
            .valueOf()
            .toString() + '.jpg';
      } else {
        const names = imageResponse.path ? imageResponse.path.split('/') : [];
        name = names && names.length > 0 ? names[names.length - 1] : '';
      }
      uri = imageResponse.path ? imageResponse.path : '';
      size = imageResponse.size ? imageResponse.size : 0;
      typeCollection = imageResponse.mime;
    }

    file = {
      uri,
      type: typeCollection,
      name,
    };

    const presignedPost: PreSignedUrlParam = {
      file_name: name,
      file_type: typeCollection,
      folder_name: 'images',
      is_public: true,
      file_size: size,
    };

    return { file, presignedPost };
  };

  const getFileVideo = (videosResponse: any) => {
    let file = {};
    let uri = '';
    let typeCollection = '';
    let name = '';
    let size = 0;

    if (videosResponse) {
      if (Platform.OS === 'ios') {
        name = videosResponse.filename;
      } else {
        const names = videosResponse.path ? videosResponse.path.split('/') : [];
        name = names && names.length > 0 ? names[names.length - 1] : '';
      }
      uri = videosResponse.path ? videosResponse.path : '';
      size = videosResponse.size ? videosResponse.size : 0;
      typeCollection = videosResponse.mime;
    }

    file = {
      uri,
      type: typeCollection,
      name,
    };

    const presignedPost: PreSignedUrlParam = {
      file_name: name,
      file_type: typeCollection,
      folder_name: 'videos',
      is_public: true,
      file_size: size,
    };

    return { file, presignedPost };
  };

  const upload: Start = ({ imageResponse, index, type, success, failure, progress }) => {
    const { file, presignedPost } = type === DocumentPicker.types.video ? getFileVideo(imageResponse) : getFileImage(imageResponse);

    dispatch(
      uploadCollection({
        file,
        presignedPost,
        onSuccess: data => {
          success && success(data, type, index);
        },
        onFail: failure,
        callback: (percentage: number) => {
          progress && progress(index, percentage);
        },
      }),
    );
  };

  return [upload];
};
