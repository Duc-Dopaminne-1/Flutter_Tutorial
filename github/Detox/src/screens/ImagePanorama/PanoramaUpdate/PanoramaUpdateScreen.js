import React, {useContext, useState} from 'react';

import {AppContext} from '../../../appData/appContext/appContext';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {useMount} from '../../commonHooks';
import useGetPanoramaByPropertyPostId from '../hooks/useGetPanoramaByPropertyPost';
import useGetSceneInfos from '../hooks/useGetSceneInfos';
import {PanoramaFormTypes} from '../PanoramaContants';
import {PanoramaUpdateContainer} from './PanoramaUpdateContainer';

type RouteParamsTypes = {
  propertyPostId: String,
  formType: String,
  onCreateSuccess: () => void,
};

export const PanoramaUpdateScreen = ({navigation, route}) => {
  const {propertyPostId, formType, onCreateSuccess}: RouteParamsTypes = route?.params || {};
  const {showMessageAlert} = useContext(AppContext);
  const [sceneInfos, setSceneInfos] = useState({});

  const [startGetPanoramaByPropertyPostId] = useGetPanoramaByPropertyPostId(setSceneInfos);
  const {panoramaImageId, storedSceneInfos} = useGetSceneInfos(sceneInfos);

  useMount(() => {
    if (formType === PanoramaFormTypes.UPDATE) {
      startGetPanoramaByPropertyPostId(propertyPostId);
    }
  });

  const onBack = () => {
    navigation.goBack();
  };

  const onSuccess = () => {
    if (formType === PanoramaFormTypes.CREATE) {
      showMessageAlert(translate(STRINGS.SUCCESS), translate('imagePanorama.messageCreateSuccess'));
      onCreateSuccess();
      navigation.goBack();
    } else {
      showMessageAlert(translate(STRINGS.SUCCESS), translate('imagePanorama.messageUpdateSuccess'));
    }
  };

  return (
    <SafeAreaScreenContainer>
      <PanoramaUpdateContainer
        propertyPostId={propertyPostId}
        panoramaImageId={panoramaImageId}
        storedSceneInfos={storedSceneInfos}
        formType={formType}
        onBack={onBack}
        onSuccess={onSuccess}
      />
    </SafeAreaScreenContainer>
  );
};
