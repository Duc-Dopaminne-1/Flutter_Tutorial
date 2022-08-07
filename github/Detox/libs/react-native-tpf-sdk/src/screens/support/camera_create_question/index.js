import React, { useState } from 'react';
import styles from './styles';
import { translate } from '../../../i18n';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import { View, TouchableOpacity, Platform } from 'react-native';
import {
  ICArrowLeftWhite,
  ICCameraReverse,
  ICFlash,
  ICImageWhite,
  ICSnap
} from '../../../assets/icons';
import SCREENS_NAME from '../../../constants/screens';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return translate(children);
  }
);

const CameraCreateQuestion = props => {
  const { base64 = false, screenName, multiple = true } = props.route.params || {};
  const androidCameraTitle = useSelector(state =>
    selectText(state, 'permission.android_camera_title')
  );
  const androidCameraMessage = useSelector(state =>
    selectText(state, 'permission.android_camera_message')
  );
  const androidCameraButtonPositive = useSelector(state =>
    selectText(state, 'permission.android_camera_button_positive')
  );
  const androidCameraButtonNegative = useSelector(state =>
    selectText(state, 'permission.android_camera_button_negative')
  );
  const androidRecordAudioTitle = useSelector(state =>
    selectText(state, 'permission.android_record_audio_title')
  );
  const androidRecordAudioMessage = useSelector(state =>
    selectText(state, 'permission.android_record_audio_message')
  );
  const androidRecordAudioButtonPositive = useSelector(state =>
    selectText(state, 'permission.android_record_audio_button_positive')
  );
  const androidRecordAudioButtonNegative = useSelector(state =>
    selectText(state, 'permission.android_record_audio_button_negative')
  );
  const camera = React.useRef(null);
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const takePicture = async () => {
    try {
      if (camera) {
        const options = { quality: 0.5, base64: base64 };
        const data = await camera.current.takePictureAsync(options);
        const date = Date.now().toString();
        const image =
          Platform.OS === 'ios'
            ? {
                sourceURL: data.uri,
                creationDate: date,
                filename: `image${date}`,
                data: data.base64
              }
            : {
                path: data.uri,
                creationDate: date,
                filename: `image${date}`,
                data: data.base64
              };
        props.navigation.navigate(SCREENS_NAME.PREVIEW_CREATE_QUESTION, {
          image,
          screenName
        });
      }
    } catch (error) {}
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const chooseImage = () => {
    props.navigation.navigate(SCREENS_NAME.PHOTOS_COLLECTION, {
      base64,
      screenName,
      multiple
    });
  };
  const reverseCamera = () => {
    if (type === RNCamera.Constants.Type.back) {
      setType(RNCamera.Constants.Type.front);
    } else {
      setType(RNCamera.Constants.Type.back);
    }
  };

  return (
    <View style={styles.cameraCreateQuestionWrapper}>
      <View style={styles.headerCamera}>
        <TouchableOpacity style={styles.itemHeader} onPress={goBack}>
          <ICArrowLeftWhite />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemHeader} onPress={goBack}>
          <ICFlash />
        </TouchableOpacity>
      </View>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: androidCameraTitle,
          message: androidCameraMessage,
          buttonPositive: androidCameraButtonPositive,
          buttonNegative: androidCameraButtonNegative
        }}
        androidRecordAudioPermissionOptions={{
          title: androidRecordAudioTitle,
          message: androidRecordAudioMessage,
          buttonPositive: androidRecordAudioButtonPositive,
          buttonNegative: androidRecordAudioButtonNegative
        }}
        // onGoogleVisionBarcodesDetected={({ barcodes }) => {}}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={chooseImage} style={styles.capture}>
          <ICImageWhite />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <ICSnap />
        </TouchableOpacity>
        <TouchableOpacity onPress={reverseCamera} style={styles.capture}>
          <ICCameraReverse />
        </TouchableOpacity>
      </View>
    </View>
  );
};

CameraCreateQuestion.propTypes = {
  // bla: PropTypes.string,
};

CameraCreateQuestion.defaultProps = {
  // bla: 'test',
};

export default CameraCreateQuestion;
