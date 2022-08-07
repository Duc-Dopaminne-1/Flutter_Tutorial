import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';

import {GetServiceTicketResultByIdForFrontOfficeResponse} from '../../../../api/graphql/generated/graphql';
import {AppContext} from '../../../../appData/appContext/appContext';
import {TOAST_MESSAGE_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import BaseScreen from '../../../../components/BaseScreen';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import {useUploadImages} from '../../../../hooks/useUploadImages';
import {supportServiceTicketProcessingStatuses} from '../../../../utils/GetMasterData';
import {mapToDataImages} from '../../../../utils/ImageUtil';
import {useMount} from '../../../commonHooks';
import {
  useExecutorSubmitTicketResult,
  useGetSupportRequestTicketResultById,
  useRequesterAcceptTicketResult,
} from '../hooks';
import useMapDataResultTicket from '../hooks/useMapDataResultTicket';
import {RequestResultContainer} from './components';
import {useRejectTicketResultView} from './components/RejectTicketResultModalContainer';

const initValue = {
  supportServiceTicketId: '',
  resultDescriptions: {
    isCorrectAddressOfPropertyPost: false,
    isCorrectDescriptionPropertyPost: false,
  },
  note: '',
  resultDocuments: {
    descriptionImproveContent: '',
    isCorrectDocumentOfPropertyPost: false,
    titleImproveContent: '',
    files: [],
  },
  resultImages: {
    bedRoomImages: [],
    entranceImages: [],
    frontHouseImages: [],
    kitchenImages: [],
    livingRoomImages: [],
    note: '',
  },
};

const mapImageToDetail = images => {
  const listImage = images?.map((item, index) => ({
    id: index,
    uri: item?.url,
    checked: true,
    name: item?.name ?? '',
  }));
  return listImage;
};

const transformTicketResult = supportServiceTicketResult => {
  let result = {...initValue};

  if (!supportServiceTicketResult) {
    return initValue;
  }

  const {resultDocuments, resultDescriptions, autoAcceptTicketInMinutes, resultImages} =
    supportServiceTicketResult || {};

  try {
    const {isCorrectAddressOfPropertyPost, isCorrectDescriptionPropertyPost} =
      JSON.parse(resultDescriptions);

    result = {
      ...result,
      resultDescriptions: {
        isCorrectAddressOfPropertyPost,
        isCorrectDescriptionPropertyPost,
      },
    };
  } catch {
    return initValue;
  }

  try {
    const {
      files: filesString,
      titleImproveContent,
      descriptionImproveContent,
      isCorrectDocumentOfPropertyPost,
    } = JSON.parse(resultDocuments);

    const files = JSON.parse(filesString);

    result = {
      ...result,
      resultDocuments: {
        titleImproveContent,
        descriptionImproveContent,
        isCorrectDocumentOfPropertyPost,
        files: Array.isArray(files) ? files : [],
      },
    };
  } catch {
    return initValue;
  }

  try {
    const {
      note,
      kitchenImages: kitchenImagesString,
      bedRoomImages: bedRoomImagesString,
      entranceImages: entranceImagesString,
      frontHouseImages: frontHouseImagesString,
      livingRoomImages: livingRoomImagesString,
    } = JSON.parse(resultImages);

    const kitchenImages = JSON.parse(kitchenImagesString);
    const bedRoomImages = JSON.parse(bedRoomImagesString);
    const entranceImages = JSON.parse(entranceImagesString);
    const frontHouseImages = JSON.parse(frontHouseImagesString);
    const livingRoomImages = JSON.parse(livingRoomImagesString);

    result = {
      ...result,
      autoAcceptTicketInMinutes: autoAcceptTicketInMinutes,
      resultImages: {
        note,
        kitchenImages: Array.isArray(kitchenImages) ? kitchenImages : [],
        bedRoomImages: Array.isArray(bedRoomImages) ? bedRoomImages : [],
        entranceImages: Array.isArray(entranceImages) ? entranceImages : [],
        frontHouseImages: Array.isArray(frontHouseImages) ? frontHouseImages : [],
        livingRoomImages: Array.isArray(livingRoomImages) ? livingRoomImages : [],
      },
    };
  } catch {
    return initValue;
  }
  return result;
};

const mapDataSubmitTickets = ({ticketId, data, ticketResultId}) => {
  return {
    supportServiceTicketResultId: ticketResultId,
    supportServiceTicketId: ticketId,
    resultDescriptions: {
      isCorrectAddressOfPropertyPost: data?.resultDescriptions?.isCorrectAddressOfPropertyPost,
      isCorrectDescriptionPropertyPost: data?.resultDescriptions?.isCorrectDescriptionPropertyPost,
    },
    resultDocuments: {
      descriptionImproveContent: data?.resultDocuments?.descriptionImproveContent ?? '',
      isCorrectDocumentOfPropertyPost: true,
      titleImproveContent: data?.resultDocuments?.titleImproveContent ?? '',
      files: JSON.stringify(mapToDataImages(data?.resultDocuments?.files)),
    },
    resultImages: {
      bedRoomImages: JSON.stringify(mapToDataImages(data?.resultImages.bedRoomImages)),
      entranceImages: JSON.stringify(mapToDataImages(data?.resultImages.entranceImages)),
      frontHouseImages: JSON.stringify(mapToDataImages(data?.resultImages.frontHouseImages)),
      kitchenImages: JSON.stringify(mapToDataImages(data?.resultImages.kitchenImages)),
      livingRoomImages: JSON.stringify(mapToDataImages(data?.resultImages.livingRoomImages)),
      note: data?.resultImages.note,
    },
  };
};

const RequestResultScreen = ({route, navigation}) => {
  const {
    isRequester,
    ticketId,
    ticketResultStatusId,
    isComplete = false,
    ticketResultId,
    viewOnly = false,
    supportServiceId,
  } = route?.params ?? {};
  const [state, setState] = useState(initValue);
  const documentImagePicker = useUploadImages();
  const entranceImagePicker = useUploadImages();
  const frontHouseImagePicker = useUploadImages();
  const livingRoomImagePicker = useUploadImages();
  const bedroomImagePicker = useUploadImages();
  const kitchenImagePicker = useUploadImages();

  const {showMessageAlert, showErrorAlert, getMasterData, showToastInfo, showAppModal} =
    useContext(AppContext);
  const masterData = getMasterData();
  const {openModal: openRejectTicketResultModal, view: RejectTicketResultModal} =
    useRejectTicketResultView({ticketId: ticketResultId});

  const {status} = supportServiceTicketProcessingStatuses(masterData, ticketResultStatusId);

  const onSuccessGetResultDetail = (res: GetServiceTicketResultByIdForFrontOfficeResponse) => {
    if (res.errorCode === 0) {
      const ticketDetail = transformTicketResult(res?.supportServiceTicketResult);
      documentImagePicker.onSetImages(mapImageToDetail(ticketDetail?.resultDocuments?.files));
      entranceImagePicker.onSetImages(mapImageToDetail(ticketDetail?.resultImages?.entranceImages));
      frontHouseImagePicker.onSetImages(
        mapImageToDetail(ticketDetail?.resultImages?.frontHouseImages),
      );
      livingRoomImagePicker.onSetImages(
        mapImageToDetail(ticketDetail?.resultImages?.livingRoomImages),
      );
      bedroomImagePicker.onSetImages(mapImageToDetail(ticketDetail?.resultImages?.bedRoomImages));
      kitchenImagePicker.onSetImages(mapImageToDetail(ticketDetail?.resultImages?.kitchenImages));
      setState(ticketDetail);
    }
  };

  const {getServiceTicketResult} = useGetSupportRequestTicketResultById({
    onSuccess: onSuccessGetResultDetail,
  });

  const onSuccessAcceptedResult = res => {
    if (res.errorCode === 0) {
      showMessageAlert('', translate(STRINGS.UPDATE_STATUS_SUCCESSFULLY));
    } else {
      showErrorAlert(res.errorMessage);
    }
  };

  const {state: data} = useMapDataResultTicket({
    containerState: state,
  });
  const {acceptTicketResult} = useRequesterAcceptTicketResult({onSuccess: onSuccessAcceptedResult});

  const {submitTicketResult} = useExecutorSubmitTicketResult({
    onSuccess: res => {
      if (!res.errorCode) {
        navigation.goBack();
      }
    },
    onError: error => {
      if (error.errorCode) {
        showToastInfo({
          messageType: TOAST_MESSAGE_TYPE.error,
          message: error.errorMessage,
          title: translate(STRINGS.ERROR),
        });
      }
    },
  });

  const sendResult = () => {
    submitTicketResult(
      mapDataSubmitTickets({
        ticketId,
        data,
        ticketResultId,
      }),
    );
  };

  const onPositiveBtnPressed = () => {
    if (isRequester) {
      showAppModal({
        isVisible: true,
        title: translate('common.agree'),
        message: translate('supportRequest.result.agreeConfirmMessage'),
        cancelText: translate('common.close'),
        okText: translate('common.confirm'),
        onOkHandler: () => acceptTicketResult(ticketResultId),
        cancelButtonStyle: HELPERS.fill,
        okButtonStyle: HELPERS.fill,
      });
    } else {
      sendResult();
    }
  };

  const onNegativeBtnPressed = () => {
    if (isRequester) {
      openRejectTicketResultModal();
    } else {
      navigation.canGoBack() && navigation.goBack();
    }
  };

  useMount(() => {
    if (ticketResultId) {
      getServiceTicketResult(ticketResultId);
    }
  });

  useEffect(() => {
    if (!isRequester) {
      setState({
        ...state,
        resultDocuments: {
          ...state.resultDocuments,
          files: documentImagePicker.imageURLs,
        },
        resultImages: {
          note: state?.resultImages?.note,
          bedRoomImages: bedroomImagePicker.imageURLs,
          entranceImages: entranceImagePicker.imageURLs,
          frontHouseImages: frontHouseImagePicker.imageURLs,
          kitchenImages: kitchenImagePicker.imageURLs,
          livingRoomImages: livingRoomImagePicker.imageURLs,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    kitchenImagePicker.imageURLs,
    bedroomImagePicker.imageURLs,
    documentImagePicker.imageURLs,
    entranceImagePicker.imageURLs,
    frontHouseImagePicker.imageURLs,
    livingRoomImagePicker.imageURLs,
  ]);

  return (
    <BaseScreen
      title={
        isRequester
          ? translate('supportRequest.result.response')
          : translate('contactAdvice.detail.sendResult')
      }
      showHeaderShadow
      modals={RejectTicketResultModal}>
      <RequestResultContainer
        state={state}
        viewOnly={viewOnly}
        documentImagePicker={documentImagePicker}
        kitchenImagePicker={kitchenImagePicker}
        bedroomImagePicker={bedroomImagePicker}
        entranceImagePicker={entranceImagePicker}
        frontHouseImagePicker={frontHouseImagePicker}
        livingRoomImagePicker={livingRoomImagePicker}
        data={data}
        resultStatus={status}
        ticketResultId={ticketResultId}
        ticketId={ticketId}
        setState={setState}
        isRequester={isRequester}
        supportServiceId={supportServiceId}
      />
      {!isComplete && (
        <View
          style={[
            commonStyles.footerContainer,
            commonStyles.borderTop,
            METRICS.resetPaddingBottom,
          ]}>
          <CustomFooterButtons
            cancelButtonTitle={
              isRequester ? translate('common.notAgree') : translate('common.cancel')
            }
            nextButtonTitle={isRequester ? translate('common.agree') : translate('common.save')}
            onPressCancel={onNegativeBtnPressed}
            onPressNext={onPositiveBtnPressed}
          />
        </View>
      )}
    </BaseScreen>
  );
};

export default RequestResultScreen;
