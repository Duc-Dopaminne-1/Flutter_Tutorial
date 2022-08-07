import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useEffect, useRef} from 'react';
import {Keyboard, PanResponder, Text, TouchableOpacity, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  CONSTANTS,
  MAX_LENGTH,
  NAVIGATION_ANIMATION_DURATION,
  NEW_POST_STEP,
} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import CheckboxList from '../../../components/Checkbox/CheckboxList';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import ImagePicker from '../../../components/ImagePickerComponent';
import InputSection from '../../../components/InputSection';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import RequiredLabel from '../../../components/RequiredLabel';
import WhiteBoxInput from '../../../components/WhiteBoxInput';
import {useUploadImages} from '../../../hooks/useUploadImages';
import {checkImageExtension, mapSourceFileToUpload, validateFile} from '../../../utils/ImageUtil';
import {openServiceDetail} from '../../PlusService/PlusServiceScreen';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import BasePostAnimationScreen from '../NewPost/BasePostAnimationScreen';
import LabelSectionLimited from '../NewPost/NewPostComponents/LabelSectionLimited';
import {NewPostStyles, plusServiceList} from '../NewPost/NewPostComponents/NewPostConstant';
import TimeLineProcessComponent from '../NewPost/NewPostComponents/TimeLineProcessComponent';
import {mapPlusServicesOptions, redirectUserOnCancelPropertyPost} from '../NewPost/NewPostUtils';
import {NewPostContext} from '../useNewPost';
import ValidatePropertyInput from '../ValidatePropertyInput';
import NewPostImagesUtils from './NewPostImagesUtils';
import styles from './styles';
import SuggestionTitleList from './SuggestionTitleList';

const mapPropsForNestedScrollViews = parentScroll => {
  let innerViewProps;

  if (parentScroll?.current) {
    const panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 2; // can adjust this num
      },
      onPanResponderGrant: () => {
        parentScroll?.current?.setNativeProps({scrollEnabled: false});
      },
      onPanResponderMove: () => {},
      onPanResponderTerminationRequest: () => true,
    });
    innerViewProps = panResponder.panHandlers;
  }

  return innerViewProps;
};

const PostImagesDescription = () => {
  const TextWithBulletPoint = ({text}) => (
    <View style={HELPERS.row}>
      <Text style={[commonStyles.blackTextBold16, METRICS.smallMarginEnd]}>•</Text>
      <Text style={commonStyles.blackText16}>{text}</Text>
    </View>
  );

  return (
    <View style={METRICS.marginTop}>
      <RequiredLabel
        title={translate(STRINGS.POLICY_IMAGE_UPLOADING)}
        titleStyle={commonStyles.blackTextBold16}
        isRequired={false}
      />
      <View style={commonStyles.separatorRow8} />
      <TextWithBulletPoint text={translate('newPost.step2.imageRules.1')} />
      <TextWithBulletPoint text={translate('newPost.step2.imageRules.2')} />
    </View>
  );
};

const mapContextToState = moduleState => {
  const step2Data = moduleState.step2Data;
  return {
    isSelectMode: false,
    legalDocuments: step2Data?.legalDocuments ?? [],
    otherServiceOptions: mapPlusServicesOptions(step2Data?.supportRequestTypeIds, plusServiceList),
    images: step2Data?.images ?? [],
    postDescription: step2Data?.postDescription,
    postTitle: step2Data?.postTitle,
    isPrivate: moduleState?.isPrivate,
    isShowGoogleStreetView: step2Data?.isShowGoogleStreetView,
    matterportUrl: step2Data?.matterportUrl,
    step1Valid: true,
    step2Valid: false,
    step3Valid: moduleState?.step3Valid,
    step4Valid: moduleState?.step4Valid,
    errors: {
      postTitle: '',
      postDescription: '',
      images: '',
    },
  };
};

const NewPostImagesScreen = ({navigation, route}) => {
  const {reload} = route?.params ?? {};
  const {track} = useAnalytics();
  const {showErrorAlert} = useContext(AppContext);
  const {state: moduleState, setInputFieldState, resetState} = useContext(NewPostContext);
  const [state, setState] = React.useState(mapContextToState(moduleState));

  const [focusedViews, setFocusedViews] = React.useState();

  const imagePickerProps = useUploadImages({
    enableSelection: true,
    defaultImages: moduleState?.step2Data?.images,
  });
  const documentPickerProps = useUploadImages({
    defaultImages: moduleState?.step2Data?.legalDocuments,
  });

  const container = useRef();
  const editor = useRef();
  const innerScrollViewProps = useRef();

  const resetValidSteps = () => {
    if (reload) {
      setState({
        ...state,
        step1Valid: true,
        step2Valid: false,
        step3Valid: moduleState?.step3Valid,
        step4Valid: moduleState?.step4Valid,
      });
    }
  };
  useEffect(resetValidSteps, [reload, moduleState.step3Valid, moduleState.step4Valid]);

  useEffect(() => {
    if (container.current) {
      innerScrollViewProps.current = mapPropsForNestedScrollViews(container);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container.current]);

  const updateStateToContext = () => {
    setInputFieldState({
      step2Data: {
        ...moduleState.step2Data,
        postTitle: state.postTitle,
        postDescription: state.postDescription,
        legalDocuments: documentPickerProps.imageURLs,
        supportRequestTypeIds: state.otherServiceOptions?.filter(e => e.checked)?.map(e => e.id),
        images: imagePickerProps.imageURLs,
        isShowGoogleStreetView: state?.isShowGoogleStreetView,
        matterportUrl: state?.matterportUrl,
      },
      step2Valid: true,
    });
  };

  const getHeaderLimited = (text, maxLength) => {
    return `${text ? String(text).length : 0}/${maxLength}`;
  };

  // Description editor can not be blurred automatically when press outside
  const blurDescriptionEditor = () => {
    container.current?.setNativeProps({scrollEnabled: true});
    if (editor.current?.isKeyboardOpen) {
      editor.current?.blurContentEditor();
    }
  };

  const onChangeTextTitle = text => {
    setState({...state, postTitle: text, errors: {...state.errors, postTitle: ''}});
  };

  const onChangeTextDescription = (text, htmlText) => {
    const isEditing = !state.postDescriptionPlainText && state.postDescription?.length > 0;
    if (isEditing) {
      setState({
        ...state,
        postDescriptionPlainText: text,
        errors: {...state.errors, postDescription: ''},
      });
    } else if (state.postDescriptionPlainText !== text) {
      setState({
        ...state,
        postDescription: htmlText,
        postDescriptionPlainText: text,
        errors: {...state.errors, postDescription: ''},
      });
    }
  };

  const modalizeRef = useRef(null);

  const onPressCancel = () => {
    Keyboard.dismiss();
    editor.current?.dismissKeyboard && editor.current?.dismissKeyboard();

    onShowPopup();
  };

  const onPressNext = () => {
    const newErrorState = ValidatePropertyInput.validatePropertyStep2({
      ...state,
      images: imagePickerProps.imageURLs,
    });
    setState({...state, errors: newErrorState});

    if (newErrorState.isValid) {
      updateStateToContext();

      if (!moduleState?.isEdit) {
        track(TrackingActions.createPostStep2, {
          post_title: state.postTitle,
          property_image_url: imagePickerProps.imageURLs[0]?.url,
          street_view_display: state?.isShowGoogleStreetView || false,
          plus_services: state?.otherServiceOptions
            ?.filter(e => e.checked)
            ?.map(e => e?.description ?? '')
            ?.join(','),
        });
      }

      navigation.navigate(ScreenIds.SelectSupportAgentScreen);
    }
  };

  const onShowStreetView = () => {
    const coordinate = {
      ...moduleState?.coordinate,
      radius: 0,
    };
    const results = ValidatePropertyInput.validateCoordinate(coordinate);
    if (results.isValid) {
      navigation.navigate(ScreenIds.Streetview, {coordinate});
    } else {
      showErrorAlert(results?.errorLat ?? results.errorLong);
    }
  };

  const onChosenOtherServices = (chosenItem, isChecked) => {
    const filteredList = state?.otherServiceOptions?.map(e => {
      if (chosenItem?.id === e.id) {
        e.checked = isChecked;
      }
      return {...e};
    });
    setState({
      ...state,
      otherServiceOptions: filteredList,
    });
  };

  const onServiceItemPress = item => {
    openServiceDetail(item, navigation);
  };

  const onPressSelectPropertyAvatar = () => {
    setState({...state, isSelectMode: !state.isSelectMode});
  };

  const onCheckShowStreetView = value => {
    setState({...state, isShowGoogleStreetView: value});
  };

  const onChangeMatterport = text => {
    setState({...state, matterportUrl: text});
  };

  const onPressBack = step => {
    updateStateToContext();

    setTimeout(() => {
      switch (step) {
        case NEW_POST_STEP.STEP1:
          navigation.navigate(ScreenIds.GeneralDescription, {reload: true});
          break;
        case NEW_POST_STEP.STEP3:
          navigation.navigate(ScreenIds.SelectSupportAgentScreen, {reload: true});
          break;
        case NEW_POST_STEP.STEP4:
          navigation.navigate(ScreenIds.NewPostContactInfo, {reload: true});
          break;
        default:
          navigation.navigate(ScreenIds.GeneralDescription, {reload: true});
          break;
      }
    }, NAVIGATION_ANIMATION_DURATION);
  };

  function onDismissPopup() {
    modalizeRef?.current?.close();
  }

  function onShowPopup() {
    modalizeRef?.current?.open();
    Keyboard?.dismiss();
  }

  const pressCallCallBack = () => {
    track(TrackingActions.callButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep2,
    });
  };

  const pressMessageCallBack = () => {
    track(TrackingActions.messagesButtonClicked, {
      click_location: ClickLocation.postPage,
      category: Category.createPostStep2,
    });
  };

  const onSelectedDocuments = documents => {
    if (
      documents &&
      documents.length > 0 &&
      !documents.map(e => validateFile(e)).find(e => e === false)
    ) {
      const mappedDocuments = mapSourceFileToUpload(documents);

      documentPickerProps.onSetImages([...documentPickerProps.imageURLs, ...mappedDocuments]);
    }
  };

  const onDeleteDocument = document => {
    const newDocuments = documentPickerProps.imageURLs?.filter(e => {
      const deletedDocumentUrl = document?.uri ?? document?.url;
      const tmpDocumentUrl = e?.uri ?? e?.url;
      return deletedDocumentUrl !== tmpDocumentUrl;
    });

    documentPickerProps.onSetImages(newDocuments);
  };

  const legalFiles =
    documentPickerProps.imageURLs?.length > 0
      ? documentPickerProps.imageURLs.filter(e => !checkImageExtension(e.url || e.uri))
      : [];
  const legalImages =
    documentPickerProps.imageURLs?.length > 0
      ? documentPickerProps.imageURLs.filter(e => checkImageExtension(e.url || e.uri))
      : [];

  const modals = (
    <ModalWithModalize getModalRef={modalizeRef}>
      <View style={styles.modalContainer}>
        <View style={styles.separatorRow30} />
        <Text style={styles.confirmText}>
          {translate('propertyPost.newPost.confirmCancelUpdatePropertyPost')}
        </Text>
        <View style={styles.separatorRow30} />
        <CustomFooterButtons
          containerStyle={styles.footerButtonsContainer}
          nextButtonStyle={[styles.footerCancelButton, styles.footerNextButton, METRICS.marginTop]}
          cancelButtonStyle={styles.footerCancelButton}
          cancelTextStyle={styles.cancelEditText}
          nextTextStyle={styles.nextEditText}
          nextButtonTitle={translate(STRINGS.CONFIRM)}
          cancelButtonTitle={translate(STRINGS.CANCEL)}
          onPressCancel={onDismissPopup}
          onPressNext={() => {
            onDismissPopup();
            resetState();

            redirectUserOnCancelPropertyPost();
          }}
        />
      </View>
    </ModalWithModalize>
  );

  return (
    <BasePostAnimationScreen
      navigation={navigation}
      testID={ScreenIds.NewPostImages}
      title={translate(STRINGS.IMAGE)}
      onBackPress={onPressBack}
      onPressNext={onPressNext}
      showContactButtons
      showHeaderShadow
      headerOptions={{containerStyle: METRICS.smallVerticalPadding}}
      allowedHeaderAnimation={true}
      headerContainerHeight={CONSTANTS.HEADER_CONTAINER_HEIGHT + CONSTANTS.HEADER_TIMELINE_HEIGHT}
      customHeaderComponent={
        <TimeLineProcessComponent
          data={{
            stepProcess: NEW_POST_STEP.STEP2,
            step1Valid: state?.step1Valid,
            step3Valid: state?.step3Valid,
            step4Valid: state?.step4Valid,
          }}
          onPressStep1={() => onPressBack(NEW_POST_STEP.STEP1)}
          onPressStep3={() => onPressBack(NEW_POST_STEP.STEP3)}
          onPressStep4={() => onPressBack(NEW_POST_STEP.STEP4)}
          style={HELPERS.fill}
        />
      }
      rightComponent={
        <CustomButton
          title={translate(STRINGS.DISCARD)}
          titleColor={COLORS.PRIMARY_A100}
          titleStyle={[FONTS.fontSize14, FONTS.bold]}
          onPress={onPressCancel}
        />
      }
      modals={modals}
      pressCallCallBack={pressCallCallBack}
      pressMessageCallBack={pressMessageCallBack}>
      <View style={styles.viewContainer}>
        <View style={styles.gestureHandlerView} onStartShouldSetResponder={blurDescriptionEditor}>
          <LabelSectionLimited
            leftProps={{title: translate(STRINGS.TITLE)}}
            rightProps={{
              title: translate(STRINGS.CHARS_SIZE, {
                value: getHeaderLimited(state.postTitle, MAX_LENGTH.TITLE_INPUT),
              }),
              isRequired: false,
            }}
          />
          <WhiteBoxInput
            textInputStyle={
              focusedViews?.postTitle
                ? [styles.textInput, {borderColor: COLORS.PRIMARY_A100}]
                : styles.textInput
            }
            placeholder={translate(STRINGS.PLACE_HOLDER_TITLE)}
            onChangeText={onChangeTextTitle}
            value={state.postTitle}
            maxLength={MAX_LENGTH.TITLE_INPUT}
            error={state.errors?.postTitle}
            onFocus={() => setFocusedViews({...focusedViews, postTitle: true})}
            onBlur={() => setFocusedViews({...focusedViews, postTitle: false})}
          />
          <SuggestionTitleList
            data={NewPostImagesUtils.getSuggestionTitles(moduleState)}
            value={state.postTitle}
            onSelectItem={onChangeTextTitle}
          />
          <LabelSectionLimited
            leftProps={{title: translate(STRINGS.DESCRIBE_PROPERTY)}}
            rightProps={{
              title: translate(STRINGS.CHARS_SIZE, {
                value: getHeaderLimited(
                  state.postDescriptionPlainText,
                  MAX_LENGTH.DESCRIPTION_INPUT,
                ),
              }),
              isRequired: false,
            }}
          />
        </View>
        <WhiteBoxInput
          ref={editor}
          textInputStyle={
            focusedViews?.postDescription
              ? [styles.textInputDescription, {borderColor: COLORS.PRIMARY_A100}]
              : styles.textInputDescription
          }
          placeholder={translate(STRINGS.FILL_DESCRIPTION)}
          onChangeText={onChangeTextDescription}
          value={state.postDescription}
          maxLength={MAX_LENGTH.DESCRIPTION_INPUT}
          error={state.errors?.postDescription}
          alignTop
          onFocus={() => setFocusedViews({...focusedViews, postDescription: true})}
          onBlur={() => setFocusedViews({...focusedViews, postDescription: false})}
          useEditor
          outerScrollViewRef={container}
          scrollViewProps={innerScrollViewProps.current}
        />
        <View style={styles.gestureHandlerView} onStartShouldSetResponder={blurDescriptionEditor}>
          <View style={commonStyles.separatorRow16} />
          <Text style={NewPostStyles.headerTitle}>{translate(STRINGS.IMAGE)}</Text>
          <View style={commonStyles.separatorRow16} />
          {imagePickerProps.imageURLs?.length > 0 && (
            <>
              <View style={styles.selectAvatarContainer}>
                <TouchableOpacity
                  style={styles.selectAvatarButton}
                  onPress={onPressSelectPropertyAvatar}>
                  <Text style={styles.selectAvatarText}>
                    {state?.isSelectMode
                      ? translate('newPost.selectPropertyAvatar')
                      : translate('newPost.changePropertyAvatar')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={commonStyles.separatorRow24} />
            </>
          )}
          <ImagePicker
            buttonUploadStyle={{
              borderColor: COLORS.PRIMARY_A100,
            }}
            buttonTitleStyle={{color: COLORS.PRIMARY_A100}}
            defaultImages={imagePickerProps.imageURLs}
            onWrongMime={imagePickerProps.onWrongMime}
            buttonTitle={translate(STRINGS.UPLOAD_IMAGE)}
            icon={IMAGES.IC_IMAGE}
            pickerTitle={translate(STRINGS.PICK_PICTURE)}
            isMaxImageUpload={imagePickerProps.imageURLs?.length >= MAX_LENGTH.DOCUMENT_IMAGES}
            onNoPermission={imagePickerProps.onNoPermission}
            onSelectedImages={imagePickerProps.onSelectedImages}
            onDeleteImage={imagePickerProps.onDeleteImage}
            disableSelectMode={!state.isSelectMode}
            isSelectMode={state.isSelectMode}
            onSingleSelectedImage={imagePickerProps.onSelectSingleImage}
            numberImagePerRow={2}
            imageHeightRadio={0.6}
            enabledMarker={true}
            maxFiles={MAX_LENGTH.DOCUMENT_IMAGES}
            errorCode={state.errors.images}
          />
          <PostImagesDescription />

          <View style={METRICS.mediumMarginTop}>
            <RequiredLabel
              title={translate('newPost.propertyDocumentCertification')}
              titleStyle={commonStyles.blackTextBold24}
              isRequired={false}
            />
            <RequiredLabel
              style={METRICS.verticalMargin}
              titleStyle={commonStyles.blackText16}
              title={translate('newPost.propertyDocumentCertificationPolicy')}
              isRequired={false}
            />
            <ImagePicker
              documents={legalFiles}
              onUploadedDocuments={onSelectedDocuments}
              onDeleteDocument={onDeleteDocument}
              buttonUploadStyle={{
                borderColor: COLORS.PRIMARY_A100,
              }}
              buttonTitleStyle={{color: COLORS.PRIMARY_A100}}
              defaultImages={legalImages}
              isMaxImageUpload={documentPickerProps.imageURLs?.length >= MAX_LENGTH.DOCUMENT_IMAGES}
              onWrongMime={documentPickerProps?.onWrongMime}
              buttonTitle={translate('newPost.step2.uploadFile')}
              icon={IMAGES.IC_IMAGE}
              pickerTitle={translate(STRINGS.PICK_PICTURE)}
              onNoPermission={documentPickerProps?.onNoPermission}
              onSelectedImages={documentPickerProps?.onSelectedImages}
              onDeleteImage={documentPickerProps?.onDeleteImage}
              disableSelectMode={true}
              numberImagePerRow={2}
              imageHeightRadio={0.6}
              maxFiles={MAX_LENGTH.DOCUMENT_IMAGES}
              enableUploadFiles
            />
          </View>

          <View style={commonStyles.separatorRow16} />
          <InputSection
            headerTitle={translate('propertyPost.newPost.matterportInputHeader')}
            headerStyles={commonStyles.blackTextBold24}
            placeholder={translate('propertyPost.newPost.matterportInputPlaceholder')}
            inputContainerStyle={commonStyles.input}
            inputStyle={styles.textInput}
            value={state?.matterportUrl}
            onChangeText={onChangeMatterport}
          />

          <View>
            <RequiredLabel
              style={METRICS.marginTopPlus}
              title={translate('newPost.streetViewTitle')}
              titleStyle={NewPostStyles.headerTitle}
              isRequired={false}
            />
            <RequiredLabel
              style={METRICS.smallVerticalMargin}
              titleStyle={styles.descriptionTitle}
              title={translate('newPost.streetViewDes')}
              isRequired={false}
            />
            <View style={styles.checkboxContainerStyle}>
              <CustomCheckbox
                images={['checkbox', 'checkbox-blank-outline']}
                customCheckedBox
                iconCheckedColor={COLORS.PRIMARY_A100}
                iconColor={COLORS.GRAY_C9}
                shouldGetValueOutSide
                parentCheckedValue={state?.isShowGoogleStreetView}
                checkValue={onCheckShowStreetView}
                title={translate('newPost.showStreetView')}
                textStyle={styles.descriptionTitle}
                titleContainerStyle={HELPERS.fill}
              />
            </View>
            {state?.isShowGoogleStreetView && (
              <CustomButton
                style={[styles.previewButton, METRICS.marginTop, METRICS.smallMarginBottom]}
                title={translate('newPost.previewStreetView')}
                titleStyle={styles.textPreviewButton}
                onPress={onShowStreetView}
                titleColor={COLORS.WHITE}
              />
            )}
          </View>
          <View style={METRICS.marginTop}>
            <CheckboxList
              customCheckedBox
              images={['checkbox', 'checkbox-blank-outline']}
              iconCheckedColor={COLORS.PRIMARY_ORANGE_10}
              iconColor={COLORS.GRAY_C9}
              title={translate('home.plusService.services')}
              titleStyle={commonStyles.blackTextBold24}
              listStyle={styles.otherServicesList}
              items={state?.otherServiceOptions}
              itemStyle={styles.itemStyle}
              itemDescriptionStyle={styles.descriptionTitle}
              onSelect={onChosenOtherServices}
              selectedItems={state?.otherServiceOptions.filter(e => e.checked)}
              separatorComponent={(item, index) => {
                return <View key={item.id + index} style={styles.separator} />;
              }}
              childComponent={item => {
                return (
                  <View style={HELPERS.fillRow}>
                    <IconButton
                      icon="chevron-right"
                      color={COLORS.GREY_92}
                      size={24}
                      onPress={() => onServiceItemPress(item)}
                    />
                  </View>
                );
              }}
            />
          </View>
          <View style={commonStyles.separatorRow24} />
        </View>
      </View>
    </BasePostAnimationScreen>
  );
};

export default NewPostImagesScreen;
