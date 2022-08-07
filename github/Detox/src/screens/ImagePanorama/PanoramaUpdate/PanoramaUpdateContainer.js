import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import WebView from 'react-native-webview';

import {CONSTANTS} from '../../../assets/constants';
import Configs, {getConfigs} from '../../../configs';
import {useUploadImages} from '../../../hooks/useUploadImages';
import useCreateC2CPropertyPostPanorama from '../hooks/useCreateC2CPropertyPostPanorama';
import type {StoredSceneInfosTypes} from '../hooks/useGetSceneInfos';
import useUpdateC2CPropertyPostPanorama from '../hooks/useUpdateC2CPropertyPostPanorama';
import {
  ContainerSideRequests,
  FormSideRequests,
  INJECTEDJAVASCRIPT,
  MaxFileUpload,
  PanoramaFormTypes,
  PanoramaPlaces,
  USER_AGENT_360,
} from '../PanoramaContants';
import {PanoramaPreview} from './PanoramaPreview';

const DEFAULT_EDITING_ID = -1;

const styles = StyleSheet.create({
  container: {flex: 1},
});

type PanoramaUpdateContainerProps = {
  propertyPostId: String,
  panoramaImageId: string,
  storedSceneInfos: StoredSceneInfosTypes[],
  formType: string,
  onBack: () => void,
  onSuccess: () => void,
};

export const PanoramaUpdateContainer = (props: PanoramaUpdateContainerProps) => {
  const {propertyPostId, panoramaImageId, storedSceneInfos, formType, onBack, onSuccess} = props;
  const [formSharedData, setFormSharedData] = useState({});
  const sceneInfosArr = useRef([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [flagChange, setFlagChange] = useState(false);
  const formRef = useRef(null);

  const source = {
    uri: Configs.imagePanoramaUpdateUrl,
    headers: {
      Cookie: getConfigs().COOKIE,
    },
  };

  const imagePickerProps = useUploadImages({
    enableSelection: true,
    defaultImages: [],
  });

  const [startUpdateC2CPropertyPostPanorama] = useUpdateC2CPropertyPostPanorama({
    onSuccess: onSuccess,
  });

  const [startCreateC2CPropertyPostPanorama] = useCreateC2CPropertyPostPanorama({
    onSuccess: onSuccess,
  });

  const onSavePanaroma = () => {
    if (formType === PanoramaFormTypes.UPDATE) {
      startUpdateC2CPropertyPostPanorama(panoramaImageId, formSharedData?.reviewData?.panoramaJson);
    } else {
      startCreateC2CPropertyPostPanorama(propertyPostId, formSharedData?.reviewData?.panoramaJson);
    }
  };

  const postMessageToForm = params => {
    formRef?.current?.postMessage(JSON.stringify(params));
  };

  const sendDataSharedToForm = useCallback(() => {
    postMessageToForm({
      type: ContainerSideRequests.REQUEST_FORM_FRAME_RECEIVE_SHARE_DATA,
      data: {
        formType: formType,
        from: PanoramaPlaces.MY_POST_DETAIL,
        propertyPostId,
        uploadedImages: sceneInfosArr.current,
        panoramaImageId,
      },
    });

    // Reset selected images
    if (imagePickerProps.imageURLs.length > 0) {
      imagePickerProps.onSetImages([]);
    }
  }, [formType, imagePickerProps, panoramaImageId, propertyPostId]);

  const onShowOrCloseReview = visible => {
    setVisiblePreview(visible);
  };

  const onDeleteImage = (uid: string) => {
    setFlagChange(true);
    sceneInfosArr.current = sceneInfosArr.current.filter(x => x.sceneId !== uid);
    sendDataSharedToForm();
  };

  const onShareData = data => {
    if (formType === PanoramaFormTypes.UPDATE && !flagChange) {
      sceneInfosArr.current = storedSceneInfos;
    }
    setFormSharedData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const onSelectImages = () => {
    ImagePicker.openPicker({
      ...CONSTANTS.GALLERY_PICKER_OPTION,
      multiple: true,
    }).then(images => {
      // Only select images Ponorama
      setFlagChange(true);
      const checkImages = _.take(
        _.filter(images, e => e.height * 2 === e.width),
        MaxFileUpload - sceneInfosArr.current.length,
      );
      imagePickerProps.onSelectedImages(checkImages, DEFAULT_EDITING_ID);
    });
  };

  useEffect(() => {
    if (imagePickerProps.imageURLs.length > 0) {
      // Convert array images to SceneInfos
      const newSceneInfos = _.map(_.cloneDeep(imagePickerProps.imageURLs), e => ({
        sceneId: uuid.v4(),
        title: e.name,
        imageUrl: e?.uri || e?.url,
        hotSpots: {},
      }));

      // Merge SceneInfos
      sceneInfosArr.current = _.take([...sceneInfosArr.current, ...newSceneInfos], MaxFileUpload);
      sendDataSharedToForm();
    }
  }, [imagePickerProps.imageURLs, sendDataSharedToForm]);

  const onMessage = event => {
    const obj = JSON.parse(event?.nativeEvent?.data);

    switch (obj?.type) {
      case FormSideRequests.REQUEST_CONTAINER_RECEIVE_SHARE_DATA:
        onShareData(obj.data);
        break;
      case FormSideRequests.REQUEST_CONTAINER_SEND_SHARE_DATA:
        sendDataSharedToForm();
        break;
      case FormSideRequests.REQUEST_CONTAINER_SELECT_IMAGES:
        onSelectImages();
        break;
      case FormSideRequests.REQUEST_CONTAINER_DELETE_IMAGE:
        onDeleteImage(obj.data);
        break;
      case FormSideRequests.REQUEST_CONTAINER_GO_TO_MY_POST_LIST:
        onBack();
        break;
      case FormSideRequests.REQUEST_CONTAINER_GO_TO_MY_POST_DETAIL:
        onBack();
        break;
      case FormSideRequests.REQUEST_CONTAINER_SHOW_REVIEW_MODAL:
        onShowOrCloseReview(true);
        break;
      case FormSideRequests.REQUEST_CONTAINER_SAVE_PANORAMA:
        onSavePanaroma();
        break;
      case FormSideRequests.REQUEST_CONTAINER_GO_TO_CONGRATS_PAGE:
        break;
      case FormSideRequests.REQUEST_CONTAINER_DONT_SHOW_TUTORIAL_HINT_AGAIN:
        break;
      default:
        break;
    }
  };

  const renderForm = () => {
    if (storedSceneInfos || formType === PanoramaFormTypes.CREATE) {
      return (
        <WebView
          ref={formRef}
          source={source}
          javaScriptEnabled
          onMessage={onMessage}
          showsVerticalScrollIndicator={false}
          injectedJavaScript={INJECTEDJAVASCRIPT}
          useWebKit={true}
          incognito={true}
          domStorageEnabled={true}
          applicationNameForUserAgent={USER_AGENT_360}
        />
      );
    }
    return null;
  };

  const renderPreview = () => {
    return (
      <PanoramaPreview
        visible={visiblePreview}
        formSharedData={formSharedData}
        onRequestClose={() => onShowOrCloseReview(false)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderForm()}
      {renderPreview()}
    </View>
  );
};
