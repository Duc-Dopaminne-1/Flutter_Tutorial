import React, {useContext} from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import BaseScreen from '../../../components/BaseScreen';
import ImageViewer from '../../../components/Image/ImageViewer';
import {usePhotoViewer} from '../../../hooks/usePhotoViewer';
import {getMapImagesForFullscreenView} from '../../../utils/ImageUtil';
import {ContactTradingContext} from '../useContactTrading';
import TradingCompleteInputContainer from './TradingCompleteDetailInputComponents/TradingCompleteInputContainer';

const TradingCompleteDetailScreen = ({navigation}) => {
  const {state: contactTradingDetail} = useContext(ContactTradingContext);
  const images = getMapImagesForFullscreenView(
    contactTradingDetail.contactTradingInfo?.contract?.attachment,
  );
  const photoViewer = usePhotoViewer();

  const onPressCancel = () => {
    navigation.goBack();
  };

  return (
    <BaseScreen
      title={translate(STRINGS.COMPLETE)}
      onBackPress={onPressCancel}
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}>
      <TradingCompleteInputContainer state={contactTradingDetail} photoViewer={photoViewer} />
      <ImageViewer
        visible={photoViewer?.state?.visible}
        images={images.map(item => ({url: item.uri}))}
        hideStatusBar={false}
        initialIndex={photoViewer?.state?.index}
        onDismiss={photoViewer?.onDismissImageViewer}
        hideShareButton={false}
        shareText={translate('common.share')}
      />
    </BaseScreen>
  );
};

export default TradingCompleteDetailScreen;
