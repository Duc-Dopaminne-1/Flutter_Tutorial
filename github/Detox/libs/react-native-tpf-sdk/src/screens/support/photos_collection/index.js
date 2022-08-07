import { getShowAlertError } from '../../../redux/actions/system';
import { ADD_IMG_FAILED } from '../../../constants/errors';
import React from 'react';
import { View } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import { IMAGE_TYPE } from '../../../global/image_type';
import styles from './styles';

const PhotosCollection = props => {
  const { screenName, base64 = 'false', multiple = true } = props.route.params || {};
  const dispatch = useDispatch();
  React.useEffect(() => {
    ImageCropPicker.openPicker({
      multiple: multiple,
      includeBase64: base64
    })
      .then(res => {
        let imgs = [];
        if (res?.length > 0) {
          imgs = res;
        } else {
          imgs.push(res);
        }
        if (imgs.length > 0) {
          imgs.map(img => {
            if (img.size / 1024000 > 5) {
              dispatch(getShowAlertError(ADD_IMG_FAILED));
              return props.navigation.navigate(screenName, {
                addImageFromPicker: [],
                photoAdded: {}
              });
            }
          });
          imgs.map(img => {
            const type = img.mime.split('/');
            if (!IMAGE_TYPE.includes(type[type?.length - 1])) {
              dispatch(
                getShowAlertError({
                  ...ADD_IMG_FAILED,
                  message: 'error_msg.image_type'
                })
              );
              return props.navigation.navigate(screenName, {
                addImageFromPicker: [],
                photoAdded: {}
              });
            }
          });
          props.navigation.navigate(screenName, {
            addImageFromPicker: imgs,
            photoAdded: {}
          });
        }
      })
      .catch(e => {
        props.navigation.goBack();
      });
  }, [base64, props.navigation, screenName, dispatch, multiple]);
  return <View style={styles.photosCollectionWrapper} />;
};

PhotosCollection.propTypes = {
  // bla: PropTypes.string,
};

PhotosCollection.defaultProps = {
  // bla: 'test',
};

export default PhotosCollection;
