import React, {useEffect, useMemo, useState} from 'react';
import Orientation, {useOrientationChange} from 'react-native-orientation-locker';

import {translate} from '../../../assets/localize';
import BaseScreen from '../../../components/BaseScreen';
import ScreenIds from '../../ScreenIds';
import {ORIENTATION_STATE, PanoramaFormTypes} from '../PanoramaContants';
import {PanoramaReviewContainer} from './PanoramaReviewContainer';

type RouteParamsTypes = {
  propertyPostId: String,
  panoramaImageCode: String,
  showEditPanoramaButton: String,
};

export const PanoramaReviewScreen = ({navigation, route}) => {
  const {propertyPostId, panoramaImageCode, showEditPanoramaButton}: RouteParamsTypes =
    route?.params || {};
  const [orientation, setOrientation] = useState(ORIENTATION_STATE.PORTRAIT);

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useOrientationChange(state => {
    if (state === ORIENTATION_STATE.LEFT || state === ORIENTATION_STATE.RIGHT) {
      setOrientation(ORIENTATION_STATE.LANDSCAPE);
    } else {
      setOrientation(ORIENTATION_STATE.PORTRAIT);
    }
  });

  const showHeader = useMemo(() => orientation === ORIENTATION_STATE.PORTRAIT, [orientation]);

  const onUpdate = () => {
    navigation.replace(ScreenIds.ImagePanoramaUpdate, {
      propertyPostId,
      formType: PanoramaFormTypes.UPDATE,
    });
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen
      title={translate('imagePanorama.imagePanoramaReviewHeaderTitle')}
      showHeader={showHeader}>
      <PanoramaReviewContainer
        panoramaImageCode={panoramaImageCode}
        showEditPanoramaButton={showEditPanoramaButton}
        onBack={onBack}
        onUpdate={onUpdate}
      />
    </BaseScreen>
  );
};
