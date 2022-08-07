import { getShowAlertError } from '../../../redux/actions/system';
import { ICArrowLeftWhite } from '../../../assets/icons';
import PrimaryButton from '../../../components/primary_button';
import { ADD_IMG_FAILED } from '../../../constants/errors';
import React, { useContext } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { IMAGE_TYPE } from '../../../global/image_type';
import { CalculateImgSize } from '../../../utils/calculateImgSize';
import styles from './styles';
import themeContext from '../../../constants/theme/themeContext';

const PreviewCreateQuestion = props => {
  const dispatch = useDispatch();
  const { fonts } = useContext(themeContext) || {};
  const {
    route: {
      params: { image, screenName }
    }
  } = props || { route: { params: {} } };
  const goBack = () => {
    props.navigation.goBack();
  };
  const sendToCreateQuestion = () => {
    if (image.sourceURL || image.path) {
      const imgSize = CalculateImgSize(image?.data);
      const imgUrl = image?.sourceURL || image?.path || '';
      const imgType = imgUrl.slice(imgUrl.length - 3);
      if (imgSize / 1024000 > 5) {
        dispatch(getShowAlertError(ADD_IMG_FAILED));
        return props.navigation.navigate(screenName, {
          addImageFromPicker: [],
          photoAdded: {}
        });
      }
      if (!IMAGE_TYPE.includes(imgType)) {
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
      props.navigation.navigate(screenName, {
        photoAdded: { ...image, size: imgSize },
        addImageFromPicker: []
      });
    }
  };

  return (
    <View style={styles.previewCreateQuestionWrapper}>
      <View style={styles.headerCamera}>
        <TouchableOpacity style={styles.itemHeader} onPress={goBack}>
          <ICArrowLeftWhite />
        </TouchableOpacity>
        <View style={styles.itemHeader} />
      </View>
      <Image source={{ uri: image.sourceURL || image.path }} style={styles.image} />
      <View style={styles.footer}>
        <PrimaryButton
          translate
          isDefault
          style={styles.capture}
          onPress={sendToCreateQuestion}
          titleStyle={[styles.captureText, { fontFamily: fonts?.SEMIBOLD }]}
          colorText={'#000'}
          title={'preview_create_question.upload_photos'}
        />
      </View>
    </View>
  );
};

PreviewCreateQuestion.propTypes = {
  // bla: PropTypes.string,
};

PreviewCreateQuestion.defaultProps = {
  // bla: 'test',
};

export default PreviewCreateQuestion;
