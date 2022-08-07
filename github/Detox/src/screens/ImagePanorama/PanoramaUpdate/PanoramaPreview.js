import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import Orientation, {useOrientationChange} from 'react-native-orientation-locker';
import WebView from 'react-native-webview';

import {translate} from '../../../assets/localize';
import {METRICS} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import ModalPopup from '../../../components/Modal/ModalPopup';
import Configs, {getConfigs} from '../../../configs';
import {
  ContainerSideRequests,
  INJECTEDJAVASCRIPT,
  ORIENTATION_STATE,
  ReviewSideRequests,
  USER_AGENT_360,
} from '../PanoramaContants';

const styles = StyleSheet.create({
  modalContainer: {...METRICS.resetPadding},
});

type PanoramaPreviewProps = {
  visible: Boolean,
  formSharedData: any,
  onRequestClose: () => void,
};

export const PanoramaPreview = (props: PanoramaPreviewProps) => {
  const {visible, formSharedData, onRequestClose} = props;
  const [orientation, setOrientation] = useState(ORIENTATION_STATE.PORTRAIT);
  const previewRef = useRef(null);

  const source = {
    uri: Configs.imagePanoramaUrl,
    headers: {
      Cookie: getConfigs().COOKIE,
    },
  };

  useEffect(() => {
    if (visible) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }
  }, [visible]);

  useOrientationChange(state => {
    if (state === ORIENTATION_STATE.LEFT || state === ORIENTATION_STATE.RIGHT) {
      setOrientation(ORIENTATION_STATE.LANDSCAPE);
    } else {
      setOrientation(ORIENTATION_STATE.PORTRAIT);
    }
  });

  const showHeader = useMemo(() => orientation === ORIENTATION_STATE.PORTRAIT, [orientation]);

  const postMessageToPreview = params => {
    previewRef?.current?.postMessage(JSON.stringify(params));
  };

  const sendReviewDataToPreview = () => {
    postMessageToPreview({
      type: ContainerSideRequests.REQUEST_REVIEW_FRAME_RECEIVE_REVIEW_DATA,
      data: formSharedData?.reviewData || null,
    });
  };

  const onMessage = event => {
    const obj = JSON.parse(event?.nativeEvent?.data);

    switch (obj?.type) {
      case ReviewSideRequests.REQUEST_CONTAINER_SEND_REVIEW_DATA:
        sendReviewDataToPreview();
        break;
      case ReviewSideRequests.REQUEST_CONTAINER_CLOSE_REVIEW:
        break;
      default:
        break;
    }
  };

  return (
    <ModalPopup
      contentContainerStyle={styles.modalContainer}
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onPressOutSide={onRequestClose}
      supportedOrientations={['landscape', 'portrait']}>
      <BaseScreen
        title={translate('imagePanorama.imagePanoramaReviewHeaderTitle')}
        onBackPress={onRequestClose}
        showHeader={showHeader}>
        <WebView
          ref={previewRef}
          source={source}
          javaScriptEnabled
          injectedJavaScript={INJECTEDJAVASCRIPT}
          onMessage={onMessage}
          showsVerticalScrollIndicator={false}
          useWebKit={true}
          incognito={true}
          domStorageEnabled={true}
          applicationNameForUserAgent={USER_AGENT_360}
          allowsFullscreenVideo={true}
        />
      </BaseScreen>
    </ModalPopup>
  );
};
