import React, {useContext, useMemo, useRef} from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import ScrollViewWithAnimatedHeader from '../../../components/List/ScrollViewWithAnimatedHeader';
import ModalWithModalize, {useModalize} from '../../../components/Modal/ModalWithModalize';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../../utils/ImageUtil';
import BaseNewPostScreen from '../NewPost/BaseNewPostScreen';
import PropertyPostUtils, {VIEW_PROPERTY_POST_HEADER_POSITION_PREVIEW} from '../PropertyPostUtils';
import {NewPostContext} from '../useNewPost';
import CommissionDetailModalContainer from './components/CommissionDetailModalContainer';
import PropertyPostContainer from './PropertyPostContainer';

const IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH, IMAGE_RATIO.R16x9);

const ReviewPropertyPostScreen = () => {
  const {state} = useContext(NewPostContext);

  // Header's state
  const [sections, setSections] = React.useState({});
  const headerNavs = useRef({});

  const commissionDetailModal = useRef(null);

  const {openModal: openCommissionDetailModal, closeModal: closeCommissionDetailModal} =
    useModalize(commissionDetailModal);

  const onViewRender = (event, sectionName) => {
    const height = event.nativeEvent.layout.height;
    const position = event.nativeEvent.layout.y;

    if (
      headerNavs.current[sectionName]?.height !== height &&
      headerNavs.current[sectionName]?.position !== position
    ) {
      headerNavs.current = {...headerNavs.current, [sectionName]: {height, position}};

      if (
        Object.keys(headerNavs.current).length >= VIEW_PROPERTY_POST_HEADER_POSITION_PREVIEW.length
      ) {
        setSections(headerNavs.current);
      }
    }
  };

  const modals = (
    <ModalWithModalize getModalRef={commissionDetailModal} handlePosition="outside">
      <CommissionDetailModalContainer
        totalAmount={PropertyPostUtils.calculateTotalCommissionAmount(
          state?.step1Data?.price,
          state?.step1Data?.commission,
          state?.step1Data?.saleCommissionCurrencyUnitId,
        )}
        topenlandPercentage={state?.step1Data?.commissionTpl}
        buyerPercentage={state?.step1Data?.commissionBuyer}
        sellerPercentage={state?.step1Data?.commissionSeller}
        onPressClose={closeCommissionDetailModal}
      />
    </ModalWithModalize>
  );

  const renderBodyView = () => (
    <PropertyPostContainer
      isPreview={true}
      viewByOtherMode={false}
      onGeneralViewRender={event =>
        onViewRender(event, translate('propertyPost.headerNav.general'))
      }
      onContactViewRender={event =>
        onViewRender(event, translate('propertyPost.headerNav.support'))
      }
      onDetailInfoViewRender={event =>
        onViewRender(event, translate('propertyPost.headerNav.detailInfo'))
      }
      onFacilityViewRender={event =>
        onViewRender(event, translate('propertyPost.headerNav.facility'))
      }
      onPressViewCommissionDetail={openCommissionDetailModal}
    />
  );
  const content = useMemo(renderBodyView, [sections]);

  return (
    <BaseNewPostScreen
      title={translate(STRINGS.REVIEW_PROPERTY_POST)}
      isShowDraft={false}
      showDefaultFooterButtons={false}
      isShowEdit={false}
      isBackable={true}
      modals={modals}>
      <ScrollViewWithAnimatedHeader
        sections={sections}
        threshold={(IMAGE_SIZE.HEIGHT * 2) / 3}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}>
        {content}
      </ScrollViewWithAnimatedHeader>
    </BaseNewPostScreen>
  );
};

export default ReviewPropertyPostScreen;
