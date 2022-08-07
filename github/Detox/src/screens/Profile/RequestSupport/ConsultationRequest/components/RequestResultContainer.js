import React, {Fragment} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';

import {MAX_LENGTH, SUPPORT_SERVICE_POST_UUID} from '../../../../../assets/constants';
import {IMAGES} from '../../../../../assets/images';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import ImageViewer from '../../../../../components/Image/ImageViewer';
import ImagePicker from '../../../../../components/ImagePickerComponent';
import InputSection from '../../../../../components/InputSection';
import RadioSelectionsView from '../../../../../components/RadioSelectionsView';
import RequiredStar from '../../../../../components/RequiredStar';
import TextView from '../../../../../components/TextView';
import {ImageSource, PhotoViewerState, usePhotoViewer} from '../../../../../hooks/usePhotoViewer';
import {getMapImagesForFullscreenView} from '../../../../../utils/ImageUtil';
import {requestResultStyles} from '../../styles';
import {RequestResultState} from '../../type';

const validationOptions = [
  {
    id: 1,
    name: translate('supportRequest.result.valid'),
    checked: false,
  },
  {
    id: 2,
    name: translate('supportRequest.result.invalid'),
    checked: false,
  },
];

const isAdequateOptions = [
  {
    id: 1,
    name: translate('supportRequest.result.adequate'),
    checked: false,
  },
  {
    id: 2,
    name: translate('supportRequest.result.inadequate'),
    checked: false,
  },
];

const Section = ({title, children}: {title: String, children: JSX.Element}) => {
  return (
    <View style={requestResultStyles.sectionContainer}>
      <Text style={requestResultStyles.sectionHeader}>{title}</Text>
      <View style={commonStyles.separatorRow16} />
      {children}
    </View>
  );
};

const RadioSelectionSection = ({
  title,
  onChoose,
  chosenId,
  data,
}: {
  title: String,
  onChoose: Function,
  chosenId: Number,
}) => {
  return (
    <>
      <Text style={commonStyles.txtFontSize14}>{title}</Text>
      <View style={commonStyles.separatorRow8} />
      <RadioSelectionsView data={data} chosenItemId={chosenId} onChosen={onChoose} />
    </>
  );
};

const ValidatationLabel = ({isValid}: {isValid: Boolean}) => {
  if (isValid) {
    return (
      <View style={[requestResultStyles.validationLabel, {backgroundColor: COLORS.GREEN_80}]}>
        <Image
          source={IMAGES.IC_SUCCESS_FILL}
          style={[requestResultStyles.validationIcon, {tintColor: COLORS.GREEN_BASIC}]}
        />
        <View style={commonStyles.separatorColumn4} />
        <Text style={{...commonStyles.txtFontSize12, color: COLORS.GREEN_BASIC}}>
          {translate('supportRequest.result.valid')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[requestResultStyles.validationLabel, {backgroundColor: COLORS.RED_80}]}>
      <Image source={IMAGES.IC_ERROR_HEXAGON} style={requestResultStyles.validationIcon} />
      <View style={commonStyles.separatorColumn4} />
      <Text style={{...commonStyles.txtFontSize12, color: COLORS.STATE_ERROR}}>
        {translate('supportRequest.result.invalid')}
      </Text>
    </View>
  );
};

const CharacteristicContainer = ({
  isRequester,
  isValidAddress,
  isValidDescription,
  onChooseAddressValidation,
  onChooseDescriptionValidation,
}: {
  isRequester: Boolean,
  isValidAddress: Boolean,
  isValidDescription: Boolean,
  onChooseAddressValidation: Funciton,
  onChooseDescriptionValidation: Funciton,
}) => {
  if (isRequester) {
    return (
      <View style={[requestResultStyles.sectionContainer, METRICS.paddingTop]}>
        <Text style={requestResultStyles.sectionHeader}>
          {translate('supportRequest.result.characteristic')}
        </Text>
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate('supportRequest.result.propertyAddress')}
          containerStyle={HELPERS.crossCenter}
          customRightComponent={
            <View style={HELPERS.fill}>
              <ValidatationLabel isValid={isValidAddress} />
            </View>
          }
        />
        <View style={commonStyles.separatorRow8} />
        <TextView
          title={translate('supportRequest.result.propertyDescriptionWithExp')}
          containerStyle={HELPERS.crossCenter}
          customRightComponent={
            <View style={HELPERS.fill}>
              <ValidatationLabel isValid={isValidDescription} />
            </View>
          }
        />
      </View>
    );
  }

  return (
    <Section title={translate('supportRequest.result.characteristic')}>
      <RadioSelectionSection
        chosenId={isValidAddress ? 1 : 2}
        onChoose={onChooseAddressValidation}
        title={translate('supportRequest.result.propertyAddress')}
        data={validationOptions}
      />
      <View style={commonStyles.separatorRow16} />
      <RadioSelectionSection
        chosenId={isValidDescription ? 1 : 2}
        onChoose={onChooseDescriptionValidation}
        title={translate('supportRequest.result.propertyDescriptionWithExp')}
        data={validationOptions}
      />
    </Section>
  );
};

const ResultStatusContainer = ({
  status,
  autoAcceptTicketInMinutes,
}: {
  status: String,
  autoAcceptTicketInMinutes: int,
}) => {
  return (
    <>
      <View style={[requestResultStyles.sectionContainer, METRICS.smallNormalPaddingBottom]}>
        <Text>
          {translate('supportRequest.result.responseRuleDescription', {
            value: autoAcceptTicketInMinutes > 0 ? (autoAcceptTicketInMinutes / 60).toFixed(1) : 0,
          })}
        </Text>
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={`${translate('common.state')}:`}
          value={status}
          valueStyle={{
            ...HELPERS.fill,
            ...HELPERS.textAlignRight,
            ...requestResultStyles.statusText,
          }}
        />
      </View>
      <View style={commonStyles.sectionSeparatorLine} />
    </>
  );
};

const ResultDocumentContainer = ({
  isRequester,
  documents,
  onWrongMimeDocument,
  onSelectSingleDocument,
  onDeleteDocument,
  onNoPermissionDocument,
  onSelectedDocuments,
  onPressImage = index => {},
  isCorrectDocument,
  onChooseIsCorrectDocument = () => {},
}: {
  isRequester: Boolean,
  documents: Array<String>,
  onWrongMimeDocument: Function,
  onSelectSingleDocument: Function,
  onDeleteDocument: Function,
  onNoPermissionDocument: Function,
  onSelectedDocuments: Function,
  onPressImage: Function,
  isCorrectDocument: String,
  onChooseIsCorrectDocument: Function,
}) => {
  return (
    <>
      {isRequester ? (
        <TextView
          title={translate('supportRequest.result.propertyDocument')}
          value={
            isCorrectDocument
              ? translate('supportRequest.result.adequate')
              : translate('supportRequest.result.inadequate')
          }
          valueStyle={{...HELPERS.fill, ...HELPERS.textAlignRight}}
        />
      ) : (
        <RadioSelectionSection
          chosenId={isCorrectDocument ? 1 : 2}
          onChoose={onChooseIsCorrectDocument}
          title={translate('supportRequest.result.propertyDocument')}
          data={isAdequateOptions}
        />
      )}
      <View style={commonStyles.separatorRow16} />
      <ImagePicker
        // defaultImages={documents}
        documents={documents}
        onWrongMime={onWrongMimeDocument}
        isMaxImageUpload={documents?.length >= MAX_LENGTH.DOCUMENT_IMAGES}
        onNoPermission={onNoPermissionDocument}
        onSelectedImages={onSelectedDocuments}
        onDeleteImage={onDeleteDocument}
        onSingleSelectedImage={onSelectSingleDocument}
        numberImagePerRow={2}
        isShowOnly={isRequester}
        imageHeightRadio={0.6}
        onPressImage={onPressImage}
        maxFiles={MAX_LENGTH.DOCUMENT_IMAGES}
      />
    </>
  );
};

const ResultContentSuggestionContainer = ({
  title,
  description,
  isRequester,
  onChangeTitle = () => {},
  onChangeDescription = () => {},
}) => {
  return (
    <>
      <View style={[commonStyles.separatorLine, METRICS.horizontalMargin]} />
      <Section title={translate('supportRequest.result.contentSuggestion')}>
        {!!isRequester && (
          <TextView
            title={translate(STRINGS.TITLE)}
            containerStyle={HELPERS.column}
            valueStyle={METRICS.smallMarginTop}
            value={title || '--'}
          />
        )}

        {!isRequester && (
          <InputSection
            headerTitle={translate(STRINGS.TITLE)}
            isRequired
            placeholder={translate('supportRequest.result.titlePlaceholder')}
            inputStyle={commonStyles.input}
            value={title}
            onChangeText={onChangeTitle}
            showLimitedLength
            maxLength={MAX_LENGTH.PROJECT_NAME_INPUT}
          />
        )}
        <View style={commonStyles.separatorRow16} />
        {!!isRequester && (
          <TextView
            title={translate('supportRequest.result.propertyDescription')}
            containerStyle={HELPERS.column}
            valueStyle={METRICS.smallMarginTop}
            value={description || '--'}
          />
        )}

        {!isRequester && (
          <InputSection
            headerTitle={translate('supportRequest.result.propertyDescription')}
            isRequired
            placeholder={translate(STRINGS.FILL_DESCRIPTION)}
            inputStyle={commonStyles.multilineInput}
            value={description}
            onChangeText={onChangeDescription}
            multiline
            showMultilineInputView
            showLimitedLength
            maxLength={MAX_LENGTH.DESCRIPTION_INPUT}
          />
        )}
      </Section>
    </>
  );
};

const ResultNoteContainer = ({
  note,
  onChangeNote,
  isRequester,
}: {
  note: String,
  onChangeNote: Function,
  isRequester: Boolean,
}) => {
  return (
    <>
      <View style={[commonStyles.separatorLine, METRICS.horizontalMargin]} />
      <Section title={translate(STRINGS.NOTE)}>
        {isRequester ? (
          <Text style={commonStyles.txtFontSize14}>{note || '--'}</Text>
        ) : (
          <InputSection
            placeholder={translate('supportRequest.result.notePlaceholder')}
            inputStyle={commonStyles.multilineInput}
            value={note}
            onChangeText={onChangeNote}
            multiline
            showMultilineInputView
            showLimitedLength
            maxLength={MAX_LENGTH.NOTE}
          />
        )}
      </Section>
    </>
  );
};

const PropertyDescriptionImagePicker = ({
  onWrongMime,
  onNoPermission,
  onSelectedImages,
  onDeleteImage,
  onSelectSingleImage,
  images,
  title,
  isShowOnly,
  onPressImage,
  isRequired,
}: {
  onWrongMime: Boolean,
  onNoPermission: Function,
  onSelectedImages: Function,
  onDeleteImage: Function,
  onSelectSingleImage: Function,
  images: Array<String>,
  title: String,
  isShowOnly: Boolean,
  onPressImage: Object,
  isRequired: Boolean,
}) => {
  return (
    <>
      <Text style={commonStyles.txtFontSize14}>
        {title} {isRequired && <RequiredStar />}
      </Text>
      <View style={commonStyles.separatorRow8} />
      <ImagePicker
        defaultImages={images}
        onWrongMime={onWrongMime}
        isMaxImageUpload={images?.length >= MAX_LENGTH.MAX_PROPERTY_IMAGES}
        onNoPermission={onNoPermission}
        onSelectedImages={onSelectedImages}
        onDeleteImage={onDeleteImage}
        onSingleSelectedImage={onSelectSingleImage}
        numberImagePerRow={2}
        imageHeightRadio={0.6}
        isShowOnly={isShowOnly}
        onPressImage={onPressImage}
        maxFiles={MAX_LENGTH.MAX_PROPERTY_IMAGES - images?.length ?? 0}
      />
      <View style={commonStyles.separatorRow16} />
    </>
  );
};

const PhotoViewer = ({photoState, photos}: {photoState: PhotoViewerState, photos: ImageSource}) => {
  return (
    <ImageViewer
      visible={photoState?.state?.visible}
      images={photos?.map(item => ({url: item.uri}))}
      hideStatusBar={false}
      initialIndex={photoState?.state?.index}
      onDismiss={photoState?.onDismissImageViewer}
      hideShareButton={false}
      shareText={translate('common.share')}
    />
  );
};

const RequestResultContainer = ({
  state,
  data,
  setState,
  documentImagePicker,
  kitchenImagePicker,
  bedroomImagePicker,
  entranceImagePicker,
  frontHouseImagePicker,
  livingRoomImagePicker,
  isRequester,
  resultStatus,
  viewOnly,
  supportServiceId,
}: {
  state: RequestResultState,
}) => {
  const documentViewer = usePhotoViewer();
  const entrancePhotoViewer = usePhotoViewer();
  const frontHousePhotoViewer = usePhotoViewer();
  const livingRoomPhotoViewer = usePhotoViewer();
  const bedroomPhotoViewer = usePhotoViewer();
  const kitchenPhotoViewer = usePhotoViewer();

  const mapDocuments = getMapImagesForFullscreenView(data?.resultDocuments?.files);
  const mapEntranceImages = getMapImagesForFullscreenView(data?.resultImages?.entranceImages);
  const mapFrontHouseImages = getMapImagesForFullscreenView(data?.resultImages.frontHouseImages);
  const mapLivingRoomImages = getMapImagesForFullscreenView(data?.resultImages.livingRoomImages);
  const mapBedroomImages = getMapImagesForFullscreenView(data?.resultImages.bedRoomImages);
  const mapKitchenImages = getMapImagesForFullscreenView(data?.resultImages.kitchenImages);

  const isValidAddress = data.resultDescriptions.isCorrectAddressOfPropertyPost;
  const isValidDescription = data.resultDescriptions.isCorrectDescriptionPropertyPost;
  const isCorrectDocument = data?.resultDocuments?.isCorrectDocumentOfPropertyPost;
  const onChooseAddressValidation = item => {
    setState({
      ...state,
      resultDescriptions: {
        ...state?.resultDescriptions,
        isCorrectAddressOfPropertyPost: item.id === 0,
      },
    });
  };
  const onChooseDescriptionValidation = item => {
    setState({
      ...state,
      resultDescriptions: {
        ...state.resultDescriptions,
        isCorrectDescriptionPropertyPost: item.id === 0,
      },
    });
  };

  const onChooseIsCorrectDocument = item => {
    setState({
      ...state,
      resultDocuments: {
        ...state.resultDocuments,
        isCorrectDocumentOfPropertyPost: item.id === 0,
      },
    });
  };
  const onChangeNote = text => {
    setState({
      ...state,
      resultImages: {
        ...state.resultImages,
        note: text,
      },
    });
  };

  const onChangeTitle = text => {
    setState({
      ...state,
      resultDocuments: {
        ...state.resultDocuments,
        titleImproveContent: text,
      },
    });
  };

  const onChangeDescription = text => {
    setState({
      ...state,
      resultDocuments: {
        ...state.resultDocuments,
        descriptionImproveContent: text,
      },
    });
  };

  const showImage = (index, photoViewer) => {
    if (isRequester) {
      photoViewer && photoViewer.onPressImage(index);
    }
  };

  const onShowDocuments = index => showImage(index, documentViewer);
  const onShowEntranceImages = index => showImage(index, entrancePhotoViewer);
  const onShowFrontHouseImages = index => showImage(index, frontHousePhotoViewer);
  const onShowLivingRoomImages = index => showImage(index, livingRoomPhotoViewer);
  const onShowBedroomImages = index => showImage(index, bedroomPhotoViewer);
  const onShowKitchenImages = index => showImage(index, kitchenPhotoViewer);

  return (
    <Fragment>
      <ScrollView>
        <View style={HELPERS.fill} pointerEvents={viewOnly ? 'none' : 'auto'}>
          {isRequester && (
            <ResultStatusContainer
              status={resultStatus}
              autoAcceptTicketInMinutes={data?.autoAcceptTicketInMinutes}
            />
          )}
          <CharacteristicContainer
            isValidAddress={isValidAddress}
            isValidDescription={isValidDescription}
            onChooseAddressValidation={onChooseAddressValidation}
            onChooseDescriptionValidation={onChooseDescriptionValidation}
            isRequester={isRequester}
          />
          <View style={[commonStyles.separatorLine, METRICS.horizontalMargin]} />
          <Section title={translate('supportRequest.result.document')}>
            <ResultDocumentContainer
              isRequester={isRequester}
              documents={data?.resultDocuments?.files}
              onWrongMimeDocument={documentImagePicker.onWrongMime}
              onSelectSingleDocument={documentImagePicker.onSelectSingleImage}
              onDeleteDocument={documentImagePicker.onDeleteImage}
              onNoPermissionDocument={documentImagePicker.onNoPermission}
              onSelectedDocuments={documentImagePicker.onSelectedImages}
              onPressImage={isRequester ? onShowDocuments : null}
              isCorrectDocument={isCorrectDocument}
              onChooseIsCorrectDocument={onChooseIsCorrectDocument}
            />
          </Section>
          {supportServiceId === SUPPORT_SERVICE_POST_UUID.IMPROVEMENT_AND_BASIC_VERIFICATION && (
            <ResultContentSuggestionContainer
              title={state?.resultDocuments?.titleImproveContent ?? ''}
              description={state?.resultDocuments?.descriptionImproveContent ?? ''}
              onChangeTitle={onChangeTitle}
              onChangeDescription={onChangeDescription}
              isRequester={isRequester}
            />
          )}
          <View style={[commonStyles.separatorLine, METRICS.horizontalMargin]} />
          <Section title={translate('supportRequest.result.propertyImage')}>
            <PropertyDescriptionImagePicker
              images={data?.resultImages?.entranceImages}
              title={`${translate('supportRequest.result.frontWayPhoto', {
                value: MAX_LENGTH.MAX_PROPERTY_IMAGES,
              })}`}
              onDeleteImage={entranceImagePicker.onDeleteImage}
              onSelectSingleImage={entranceImagePicker.onSelectSingleImage}
              onSelectedImages={entranceImagePicker.onSelectedImages}
              onNoPermission={entranceImagePicker.onNoPermission}
              onWrongMime={entranceImagePicker.onWrongMime}
              isShowOnly={isRequester}
              isRequired
              onPressImage={isRequester ? onShowEntranceImages : null}
            />
            <PropertyDescriptionImagePicker
              images={data?.resultImages.frontHouseImages}
              title={`${translate('supportRequest.result.frontHousePhoto', {
                value: MAX_LENGTH.MAX_PROPERTY_IMAGES,
              })}`}
              onDeleteImage={frontHouseImagePicker.onDeleteImage}
              onSelectSingleImage={frontHouseImagePicker.onSelectSingleImage}
              onSelectedImages={frontHouseImagePicker.onSelectedImages}
              onNoPermission={frontHouseImagePicker.onNoPermission}
              onWrongMime={frontHouseImagePicker.onWrongMime}
              isShowOnly={isRequester}
              isRequired
              onPressImage={isRequester ? onShowFrontHouseImages : null}
            />
            <PropertyDescriptionImagePicker
              images={data?.resultImages.livingRoomImages}
              title={`${translate('supportRequest.result.livingRoomPhoto', {
                value: MAX_LENGTH.MAX_PROPERTY_IMAGES,
              })}`}
              onDeleteImage={livingRoomImagePicker.onDeleteImage}
              onSelectSingleImage={livingRoomImagePicker.onSelectSingleImage}
              onSelectedImages={livingRoomImagePicker.onSelectedImages}
              onNoPermission={livingRoomImagePicker.onNoPermission}
              onWrongMime={livingRoomImagePicker.onWrongMime}
              isShowOnly={isRequester}
              isRequired
              onPressImage={isRequester ? onShowLivingRoomImages : null}
            />
            <PropertyDescriptionImagePicker
              images={data?.resultImages?.bedRoomImages}
              title={`${translate('supportRequest.result.bedroomPhoto', {
                value: MAX_LENGTH.MAX_PROPERTY_IMAGES,
              })}`}
              onDeleteImage={bedroomImagePicker.onDeleteImage}
              onSelectSingleImage={bedroomImagePicker.onSelectSingleImage}
              onSelectedImages={bedroomImagePicker.onSelectedImages}
              onNoPermission={bedroomImagePicker.onNoPermission}
              onWrongMime={bedroomImagePicker.onWrongMime}
              isShowOnly={isRequester}
              isRequired
              onPressImage={isRequester ? onShowBedroomImages : null}
            />
            <PropertyDescriptionImagePicker
              images={data?.resultImages?.kitchenImages}
              title={`${translate('supportRequest.result.kitchenPhoto', {
                value: MAX_LENGTH.MAX_PROPERTY_IMAGES,
              })}`}
              onDeleteImage={kitchenImagePicker.onDeleteImage}
              onSelectSingleImage={kitchenImagePicker.onSelectSingleImage}
              onSelectedImages={kitchenImagePicker.onSelectedImages}
              onNoPermission={kitchenImagePicker.onNoPermission}
              onWrongMime={kitchenImagePicker.onWrongMime}
              isShowOnly={isRequester}
              isRequired
              onPressImage={isRequester ? onShowKitchenImages : null}
            />
          </Section>
          <ResultNoteContainer
            note={state?.resultImages?.note ?? ''}
            onChangeNote={onChangeNote}
            isRequester={isRequester}
          />
        </View>
      </ScrollView>
      <PhotoViewer photoState={documentViewer} photos={mapDocuments} />
      <PhotoViewer photoState={entrancePhotoViewer} photos={mapEntranceImages} />
      <PhotoViewer photoState={frontHousePhotoViewer} photos={mapFrontHouseImages} />
      <PhotoViewer photoState={livingRoomPhotoViewer} photos={mapLivingRoomImages} />
      <PhotoViewer photoState={bedroomPhotoViewer} photos={mapBedroomImages} />
      <PhotoViewer photoState={kitchenPhotoViewer} photos={mapKitchenImages} />
    </Fragment>
  );
};

export default RequestResultContainer;
