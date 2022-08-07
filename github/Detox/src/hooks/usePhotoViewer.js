import {useState} from 'react';

export interface ImageSource {
  url: String;
}

export interface PhotoViewerState {
  visible: Boolean;
  images: Array<ImageSource>;
  index: Number;
}

export const usePhotoViewer = () => {
  const [state, setState] = useState({visible: false, images: [], index: 0});
  const onPressImage = index => {
    setState({
      ...state,
      visible: true,
      index,
    });
  };
  const onDismissImageViewer = () => {
    setState({
      ...state,
      visible: false,
    });
  };
  return {
    state,
    setState,
    onPressImage,
    onDismissImageViewer,
  };
};
