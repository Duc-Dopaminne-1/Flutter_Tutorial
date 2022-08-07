import findIndex from 'lodash/findIndex';
import React, {useState} from 'react';
import {Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {CONSTANTS, NAVIGATION_ANIMATION_DURATION, PICKER_IMAGE} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, normal, smallNormal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {useGetSecuredFileUrl} from '../hooks/useGetSecuredFileUrl';
import useUploadDocument, {Document} from '../hooks/useUploadDocument';
import {callAfterInteraction} from '../screens/commonHooks';
import logService from '../service/logService';
import ArrayUtils from '../utils/ArrayUtils';
import {downloadFileAzure} from '../utils/fileHandler';
import {checkMime} from '../utils/ImageUtil';
import NumberUtils from '../utils/NumberUtils';
import ImageProgress from './ImageProgress';
import ModalPicker from './Modal/ModalPicker';

const DEFAULT_EDITING_ID = -1;

const SingleSelectableIndicatorView = ({isSelected, disabled = true, onPress}) => {
  const highlightStyle = isSelected ? {backgroundColor: COLORS.PRIMARY_A100} : {};
  return (
    <View style={styles.selectableItemContainer} pointerEvents={disabled ? 'none' : 'auto'}>
      <TouchableOpacity style={styles.selectableItemButton} onPress={onPress}>
        <View style={[styles.selectableIndicatorContainer, highlightStyle]}>
          <View style={[styles.selectableIndicatorInnerCircle1, highlightStyle]}>
            <View style={styles.selectableIndicatorInnerCircle2} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const removeImageItemFromArray = (item, images) => {
  if (!images || !images?.length) {
    return [];
  }

  if (!item) {
    return [...images];
  }

  const newArr = [...images];
  const itemIndex = findIndex(images, {id: item.id});
  if (itemIndex !== -1) {
    newArr.splice(itemIndex, 1);
  }
  const reIndexingNewArr = newArr.map((e, index) => {
    return {...e, id: index};
  });
  return reIndexingNewArr;
};

const ImageItem = ({
  index,
  item,
  onRemove,
  onEditImage,
  onSelectSingleSelection,
  isShowOnly = false,
  isDisabled,
  isSelecting,
  disableSelecting,
  numberImagePerRow = 3,
  imageHeightRadio = 1,
  iconRemove = IMAGES.IC_DELETE_IMAGE,
  enabledMarker,
  hideCloseButton,
}) => {
  const imageUrl = item?.uri || item?.url || '';
  const width =
    (screen.width - (normal * 2 + smallNormal * (numberImagePerRow - 1))) / numberImagePerRow;
  const uploadedImage = {
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: width,
    height: width * imageHeightRadio,
    overflow: 'hidden',
  };

  return (
    <TouchableOpacity key={index} onPress={onEditImage} disabled={isDisabled}>
      <ImageProgress
        url={imageUrl}
        containerStyle={uploadedImage}
        imageContainerStyle={uploadedImage}
      />
      {isShowOnly || hideCloseButton || (
        <TouchableOpacity style={styles.closeIcon} disabled={isDisabled} onPress={onRemove}>
          <Image source={iconRemove} style={styles.shadow} resizeMode="contain" />
        </TouchableOpacity>
      )}
      {isSelecting && (
        <SingleSelectableIndicatorView
          disabled={disableSelecting}
          onPress={() => onSelectSingleSelection(item.id)}
          isSelected={item.checked}
        />
      )}
      {item.checked && !isSelecting && enabledMarker && (
        <View style={styles.avatarMarkerContainer}>
          <Text style={styles.textAvatar}>{translate('common.avatar')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const PostImageItem = ({
  item,
  index,
  data,
  onRemoveItem,
  onEditItem,
  isShowOnly = false,
  isDisabled,
  isSelecting,
  disableSelecting,
  onSelectSingleSelection,
  numberImagePerRow = 3,
  imageHeightRadio = 1,
  iconRemove = IMAGES.IC_DELETE_IMAGE,
  enabledMarker,
  hideCloseButton,
}) => {
  const onRemove = () => {
    onRemoveItem(item);
  };

  const onEdit = () => {
    onEditItem(item);
  };
  if (index > 0 && index === data.length - 1) {
    const ButtonUpload = item.view || null;
    return ButtonUpload;
  }
  return (
    <ImageItem
      key={index}
      index={index}
      item={item}
      onRemove={onRemove}
      onEditImage={onEdit}
      isShowOnly={isShowOnly}
      isDisabled={isDisabled}
      isSelecting={isSelecting}
      disableSelecting={disableSelecting}
      onSelectSingleSelection={onSelectSingleSelection}
      numberImagePerRow={numberImagePerRow}
      imageHeightRadio={imageHeightRadio}
      iconRemove={iconRemove}
      enabledMarker={enabledMarker}
      hideCloseButton={hideCloseButton}
    />
  );
};

const RenderButtonUpload = ({
  buttonUploadStyle,
  isDisabled,
  icon,
  buttonTitle,
  onPressUploadTransactionFile,
  isInlineWithFlatList = false,
  buttonTitleStyle,
  numberImagePerRow,
  imageHeightRadio = 1,
}) => {
  let viewSize = null;
  if (isInlineWithFlatList) {
    /**
     * width = sub 2 horizontal padding & separator between items per row
     */
    const width =
      (screen.width - (normal * 2 + smallNormal * (numberImagePerRow - 1))) / numberImagePerRow;

    viewSize = {
      width: width,
      height: numberImagePerRow > 1 ? width * imageHeightRadio : 48,
      ...(numberImagePerRow > 1 || HELPERS.row),
    };
  }

  return (
    <TouchableOpacity
      key={-1}
      style={[
        styles.uploadButton,
        isInlineWithFlatList ? styles.buttonUploadInline : styles.buttonUpload,
        buttonUploadStyle,
        isDisabled ? styles.buttonUploadDisabled : {},
        viewSize,
      ]}
      onPress={onPressUploadTransactionFile}
      disabled={isDisabled}>
      <Image source={icon} style={styles.iconFile} resizeMode="contain" />
      <View style={commonStyles.separatorColumn8} />
      <Text style={[styles.textFileName, buttonTitleStyle]}>{buttonTitle ?? ''}</Text>
    </TouchableOpacity>
  );
};

const renderItem = ({
  item,
  index,
  isShowOnly = false,
  data,
  isDisabled,
  isSelecting,
  disableSelecting,
  onSelectSingleSelection,
  hideCloseButton,
  onDeleteImage,
  onPressImage,
  imageHeightRadio,
  iconRemove,
  numberImagePerRow,
  defaultImages = [],
  receiveImages,
  enabledMarker,
}) => {
  const removeImage = (image, deleteImage) => {
    const newArr = removeImageItemFromArray(image, [...defaultImages]);
    deleteImage(newArr, image);
  };

  const editImage = image => {
    if (onPressImage) {
      onPressImage(image.id ?? index);
    } else if (!isShowOnly) {
      const sourceToUse = image.uri || image.url;

      Image.getSize(sourceToUse, (width, height) => {
        ImagePicker.openCropper({
          ...CONSTANTS.CROP_PICKER_OPTION,
          width: width,
          height: height,
          path: sourceToUse,
        })
          .then(selectedImage => {
            receiveImages([selectedImage], image.id);
          })
          .catch(error => {
            logService.log('user cancel pick photo', JSON.stringify(error));
          });
      });
    }
  };

  return (
    <PostImageItem
      key={index}
      item={item}
      index={index}
      onRemoveItem={image => removeImage(image, onDeleteImage)}
      onEditItem={editImage}
      isShowOnly={isShowOnly}
      data={data}
      isDisabled={isDisabled}
      isSelecting={isSelecting}
      disableSelecting={disableSelecting}
      onSelectSingleSelection={onSelectSingleSelection}
      numberImagePerRow={numberImagePerRow}
      imageHeightRadio={imageHeightRadio}
      iconRemove={iconRemove}
      enabledMarker={enabledMarker}
      hideCloseButton={hideCloseButton}
    />
  );
};

const ImagePickerComponent = ({
  defaultImages = [],
  documents = [],
  onDeleteImage = () => {},
  onDeleteDocument = () => {},
  errorCode,
  onWrongMime,
  buttonTitle = translate(STRINGS.UPLOAD_IMAGE),
  icon = IMAGES.UPLOAD_FILL,
  pickerTitle = translate(STRINGS.PICK_PICTURE),
  isDisabled = false,
  isShowOnly = false,
  onNoPermission = () => {},
  onUploadedDocuments = () => {},
  onSelectedImages = () => {},
  onSingleSelectedImage = () => {},
  buttonUploadStyle = {},
  isMaxImageUpload = false,
  isSelectMode = false,
  disableSelectMode = false,
  numberImagePerRow = 3,
  buttonTitleStyle,
  imageHeightRadio = 1,
  iconRemove = IMAGES.IC_DELETE_IMAGE,
  enabledMarker = false,
  hideUploadButton = false,
  hideCloseButton = false,
  onPressImage,
  onPressDocument,
  maxFiles = 5, // iosOnly
  enableUploadFiles = false,
}: {
  documents: [],
  onDeleteDocument: (document: Document, index: Number) => {},
  onUploadedDocuments: (documents: Array<Document>) => {},
  onPressDocument: (document: Document, index: Number) => {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const onPressUploadTransactionFile = () => {
    setShowPicker(true);
  };

  const getFileDownloadUrl = useGetSecuredFileUrl();
  const {openDocument} = useUploadDocument();

  // <relocate upload button into flatlist when there is 1 or more images>
  const mapImages = imgs => {
    if (imgs?.length > 0) {
      const removeExistedUploadButton = imgs.filter(e => !e.view);
      if (hideUploadButton || isShowOnly) {
        removeExistedUploadButton.push({view: null});
      } else {
        removeExistedUploadButton.push({
          view: (
            <RenderButtonUpload
              key={'image-upload-button'}
              buttonUploadStyle={buttonUploadStyle}
              isDisabled={isDisabled || isMaxImageUpload}
              icon={icon}
              buttonTitle={buttonTitle}
              buttonTitleStyle={buttonTitleStyle}
              onPressUploadTransactionFile={onPressUploadTransactionFile}
              isInlineWithFlatList
              numberImagePerRow={numberImagePerRow}
              imageHeightRadio={imageHeightRadio}
            />
          ),
        });
      }
      return removeExistedUploadButton;
    }
    return imgs;
  };

  const images = mapImages(defaultImages);

  const receiveImages = (selectedImages, editingId = DEFAULT_EDITING_ID) => {
    if (selectedImages && selectedImages.length > 0) {
      onSelectedImages(selectedImages, editingId);
    }
  };

  const receiveDocuments = (selectedDocs: Array<Document>) => {
    if (selectedDocs && selectedDocs.length > 0) {
      onUploadedDocuments(selectedDocs);
    }
  };

  const openAction = action => {
    action
      .then(selectedImages => {
        if (!Array.isArray(selectedImages)) {
          selectedImages = [selectedImages];
        }
        let isCorrectMime = true;
        const arrayImageSource = selectedImages?.map(e => {
          if (!checkMime(e)) {
            isCorrectMime = false;
          }
          return e;
        });
        if (isCorrectMime) {
          setTimeout(() => {
            receiveImages(arrayImageSource);
          }, NAVIGATION_ANIMATION_DURATION * 2);
        } else {
          setTimeout(() => {
            onWrongMime();
          }, NAVIGATION_ANIMATION_DURATION * 2);
        }
      })
      .catch(error => {
        if (error.code === 'E_PERMISSION_MISSING') {
          setTimeout(() => {
            onNoPermission();
          }, NAVIGATION_ANIMATION_DURATION * 2);
        }
      });
  };

  const openCamera = () => {
    if (Platform.OS === 'android') {
      openAction(
        ImagePicker.openCamera({
          ...CONSTANTS.CAMERA_PICKER_OPTION,
          ...CONSTANTS.CROP_PICKER_OPTION,
        }),
      );
    } else {
      ImagePicker.openCamera({
        cropping: false,
      }).then(source => {
        const {path, width, height} = source;

        openAction(
          ImagePicker.openCropper({
            ...CONSTANTS.CROP_PICKER_OPTION,
            width: width,
            height: height,
            path: path,
          }),
        );
      });
    }
  };

  const openGallery = () => {
    const sizeSelection = Platform.OS === 'ios' ? {maxFiles: maxFiles} : null;
    openAction(
      ImagePicker.openPicker({
        ...CONSTANTS.GALLERY_PICKER_OPTION,
        ...CONSTANTS.IMAGE_PICKER_MAX_HEIGHT_OPTION,
        multiple: true,
        ...sizeSelection,
      }),
    );
  };

  const onPermissionResult = (action, result) => {
    switch (result) {
      case RESULTS.DENIED:
        setShowPicker(false);
        break;
      case RESULTS.GRANTED:
        action.id === PICKER_IMAGE.CAMERA ? openCamera() : openGallery();
        break;
      case RESULTS.BLOCKED:
        setShowPicker(false);
        onNoPermission();
        break;
    }
  };

  async function handleActionType(action) {
    switch (action.id) {
      case PICKER_IMAGE.CAMERA:
        Promise.all([
          request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA),
        ]).then(([cameraStatus]) => {
          setTimeout(() => {
            onPermissionResult(action, cameraStatus);
          }, NAVIGATION_ANIMATION_DURATION * 2);
        });
        break;
      case PICKER_IMAGE.GALLERY:
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            openGallery();
          }, NAVIGATION_ANIMATION_DURATION * 2);
        } else {
          Promise.all([request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)]).then(
            ([readExternalStorageStatus]) => {
              setTimeout(() => {
                onPermissionResult(action, readExternalStorageStatus);
              }, NAVIGATION_ANIMATION_DURATION * 2);
            },
          );
        }
        break;
      case PICKER_IMAGE.DOCUMENT:
        setTimeout(() => {
          openDocument()
            .then(files => {
              receiveDocuments(files);
            })
            .catch(err => logService.log('Document picker error: ', err));
        }, NAVIGATION_ANIMATION_DURATION * 2);

        break;
    }
  }

  const onChooseAction = action => {
    setShowPicker(false);
    callAfterInteraction(() => {
      handleActionType(action);
    });
  };

  const downloadFile = file => {
    getFileDownloadUrl(file?.url || file?.uri)
      .then(async fileUrl => {
        await downloadFileAzure(fileUrl, file?.name);
      })
      .catch(err => {
        logService.log('Download file error: ', err);
      });
  };

  const onPressFile = (file, index) => {
    if (onPressDocument) {
      onPressDocument(file, index);
      return;
    }

    downloadFile(file);
  };

  const columnWrapperStyle = numberImagePerRow > 1 && {
    columnWrapperStyle: {justifyContent: 'space-between'},
  };

  const customImageList = ({data = [], numColumns = 1, ItemSeparatorComponent}) => {
    if (ArrayUtils.hasArrayData(data) && numColumns > 0) {
      const length = data.length;
      const extRow = length % numColumns !== 0 ? 1 : 0;
      const rows = NumberUtils.parseIntValue(length / numColumns) + extRow;

      const listItemView = [];
      for (let i = 0; i < rows; i++) {
        const children = [];
        for (let j = 0; j < numColumns; j++) {
          const index = i * numColumns + j;
          if (index < length) {
            children.push(
              renderItem({
                item: data[index],
                index,
                isShowOnly,
                data,
                isDisabled,
                isSelecting: isSelectMode,
                disableSelecting: disableSelectMode,
                onSelectSingleSelection: onSingleSelectedImage,
                hideCloseButton,
                onDeleteImage,
                onPressImage,
                numberImagePerRow,
                imageHeightRadio,
                iconRemove,
                enabledMarker,
                receiveImages,
                defaultImages,
              }),
            );
          }
        }
        const viewItem = (
          <View key={i}>
            <View style={[columnWrapperStyle?.columnWrapperStyle, HELPERS.fillRow]}>
              {children}
            </View>
            {rows > 1 && i !== rows - 1 && ItemSeparatorComponent}
          </View>
        );

        listItemView.push(viewItem);
      }
      return listItemView;
    } else {
      return null;
    }
  };

  const documentList = ({data, onDelete}) => {
    if (data && data.length > 0) {
      return (
        <View style={METRICS.marginBottom}>
          {data.map((e, index) => (
            <TouchableOpacity key={`${e.name}_${index}`} onPress={() => onPressFile(e, index)}>
              {index <= data.length && <View style={commonStyles.separatorRow8} />}
              <View style={styles.documentContainer} key={e.name}>
                <View style={HELPERS.fillRow}>
                  <Image
                    source={IMAGES.IC_DOCUMENT}
                    style={styles.documentIcon}
                    resizeMode="contain"
                  />
                  <View style={commonStyles.separatorColumn8} />
                  <Text style={styles.documentName} ellipsizeMode="tail" numberOfLines={1}>
                    {e?.name}
                  </Text>
                </View>
                {!isShowOnly && (
                  <TouchableOpacity
                    style={styles.closeIconContainer}
                    disabled={isDisabled}
                    onPress={() => onDelete(e, index)}>
                    <Image
                      source={IMAGES.IC_DELETE_IMAGE}
                      style={styles.shadow}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View>
      {documentList({data: documents, onDelete: onDeleteDocument})}
      {isShowOnly || defaultImages?.length !== 0 || (
        <RenderButtonUpload
          buttonUploadStyle={buttonUploadStyle}
          isDisabled={isDisabled || isMaxImageUpload}
          icon={icon}
          buttonTitle={buttonTitle}
          buttonTitleStyle={buttonTitleStyle}
          onPressUploadTransactionFile={onPressUploadTransactionFile}
        />
      )}
      <View style={HELPERS.fill}>
        {customImageList({
          data: images,
          numColumns: numberImagePerRow,
          ItemSeparatorComponent: <View style={commonStyles.separatorRow12} />,
        })}
      </View>
      {errorCode ? <Text style={styles.errorText}>{translate(errorCode)}</Text> : null}
      <ModalPicker
        cancelText={translate(STRINGS.CANCEL)}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        pickerTitle={pickerTitle}
        items={CONSTANTS.getImagePickerOptions(enableUploadFiles)}
        onChooseAction={onChooseAction}
      />
    </View>
  );
};

const screen = Dimensions.get('screen');
const styles = StyleSheet.create({
  textFileName: {
    ...commonStyles.txtFontSize16,
    color: COLORS.PRIMARY_A10,
    ...FONTS.bold,
  },
  buttonUpload: {
    width: '100%',
    minHeight: 48,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderStyle: 'dashed',
    borderColor: COLORS.PRIMARY_A100,
    ...HELPERS.center,
    ...HELPERS.row,
  },
  buttonUploadInline: {
    width: 110,
    height: 110,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderRadius: SIZES.BORDER_RADIUS_8,
    borderStyle: 'dashed',
    ...HELPERS.center,
    ...HELPERS.row,
  },
  buttonUploadDisabled: {
    opacity: 0.4,
  },
  iconFile: {
    width: 20,
    height: 22,
    tintColor: COLORS.PRIMARY_A100,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: SIZES.FONT_14,
    ...FONTS.regular,
  },
  closeIcon: {
    ...METRICS.smallMarginEnd,
    ...METRICS.smallMarginTop,
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shadow: {
    width: 24,
    height: 24,
    shadowColor: COLORS.PRIMARY_A100,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: {
      width: 1, // These can't both be 0
      height: 1, // i.e. the shadow has to be offset in some way
    },
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeIconContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButton: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderColor: COLORS.PRIMARY_A10,
  },
  selectableItemContainer: {
    ...HELPERS.absoluteFill,
    zIndex: 2,
  },
  selectableItemButton: {
    ...HELPERS.fill,
    padding: 6,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.TRANSPARENT,
  },
  selectableIndicatorContainer: {
    width: 24,
    height: 24,
    padding: 2,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_C9,
    overflow: 'hidden',
  },
  selectableIndicatorInnerCircle1: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectableIndicatorInnerCircle2: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  textAvatar: {
    fontSize: SIZES.FONT_14,
    lineHeight: 20,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
  avatarMarkerContainer: {
    ...HELPERS.center,
    width: 92,
    height: 26,
    position: 'absolute',
    start: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_B100,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  documentName: {
    ...HELPERS.fill,
    ...commonStyles.blackText16,
    ...METRICS.marginEnd,
    textDecorationLine: 'underline',
  },
  documentIcon: {
    tintColor: COLORS.PRIMARY_A100,
    width: 24,
    height: 24,
  },
  documentContainer: {
    ...HELPERS.fillRowSpaceBetween,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.BLACK_OPACITY_01,
  },
});

export default ImagePickerComponent;
