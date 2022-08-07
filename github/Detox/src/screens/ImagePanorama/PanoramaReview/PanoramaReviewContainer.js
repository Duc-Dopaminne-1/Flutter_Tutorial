import React, {useCallback, useRef, useState} from 'react';
import WebView from 'react-native-webview';

import Configs, {getConfigs} from '../../../configs';
import {useMount} from '../../commonHooks';
import useGetPanoramaByCode from '../hooks/useGetPanoramaByCode';
import {
  ContainerSideRequests,
  INJECTEDJAVASCRIPT,
  ReviewSideRequests,
  USER_AGENT_360,
} from '../PanoramaContants';

type PanoramaReviewContainerProps = {
  panoramaImageCode: String,
  showEditPanoramaButton: Boolean,
  onBack: () => void,
  onUpdate: () => void,
};

export const PanoramaReviewContainer = (props: PanoramaReviewContainerProps) => {
  const {panoramaImageCode, showEditPanoramaButton, onBack, onUpdate} = props;
  const [panoramaDetail, setPanoramaDetail] = useState(null);
  const reviewRef = useRef(null);
  const [startGetPanoramaByCode] = useGetPanoramaByCode(setPanoramaDetail);

  const source = {
    uri: Configs.imagePanoramaUrl,
    headers: {
      Cookie: getConfigs().COOKIE,
    },
  };

  useMount(() => {
    startGetPanoramaByCode(panoramaImageCode);
  });

  const postMessageToReviewFrame = params => {
    reviewRef?.current?.postMessage(JSON.stringify(params));
  };

  const sendReviewDataToReviewFrame = useCallback(() => {
    if (panoramaDetail?.panoramaImageDto) {
      const dto = panoramaDetail.panoramaImageDto;
      postMessageToReviewFrame({
        type: ContainerSideRequests.REQUEST_REVIEW_FRAME_RECEIVE_REVIEW_DATA,
        data: {
          propertyPostId: dto.propertyPostId,
          panoramaJson: dto.panoramaImageJson,
          showUpdateButton: showEditPanoramaButton,
        },
      });
    }
  }, [panoramaDetail, showEditPanoramaButton]);

  const onClose = () => {
    onBack();
  };

  const onMessage = event => {
    const obj = JSON.parse(event?.nativeEvent?.data);
    switch (obj?.type) {
      case ReviewSideRequests.REQUEST_CONTAINER_SEND_REVIEW_DATA:
        sendReviewDataToReviewFrame();
        break;
      case ReviewSideRequests.REQUEST_CONTAINER_GO_TO_UPDATE_PAGE:
        onUpdate();
        break;
      case ReviewSideRequests.REQUEST_CONTAINER_CLOSE_REVIEW:
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {panoramaDetail && (
        <WebView
          ref={reviewRef}
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
      )}
    </>
  );
};
