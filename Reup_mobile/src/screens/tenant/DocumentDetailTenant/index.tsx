import React, { useState } from 'react';
import Container from '@src/components/Container';
import translate from '@src/localize';
import styles from './styles';
import { View, Image, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CustomText } from '@src/components/CustomText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageViewerCustom } from '@src/components/ImageViewer';
import { CustomFlatList } from '@src/components/FlatList';
import { CustomTouchable } from '@src/components/CustomTouchable';
import FastImage from 'react-native-fast-image';
import IC_EXCEL from '@src/res/icons/files/excel.png';
import IC_WORD from '@src/res/icons/files/word.png';
import IC_PDF from '@src/res/icons/files/pdf.png';
import RNFetchBlob from 'rn-fetch-blob';
import { ICompanyDocument } from '@reup/reup-api-sdk/libs/api/company/document/models';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { formatApiToUI } from '@src/utils/date';
import { getUserName } from '@src/utils';
import { DocumentType } from '@reup/reup-api-sdk/libs/api/enum';

interface Props {
  item: ICompanyDocument
}

const DocumentDetailTenant = () => {
  const route = useRoute();
  const { item } = route.params as Props;
  const [idxSelectImage, setIdxSelectImage] = useState<number>();
  const [showImages, setShowImages] = useState<boolean>(false);

  const onLoadImage = () => {
  }

  const onLoadFile = () => {
  }

  const onPressImage = ({ index }: { item: any; index: number }) => {
    setIdxSelectImage(index)
    setShowImages(true);
  }

  const onBackdropPress = () => {
    setShowImages(false);
  }

  const renderItemImage = (item: IImageInfo, index: number) => {
    return (
      <CustomTouchable onPress={() => onPressImage({ item, index })}>
        <FastImage source={{ uri: item.url }} style={styles.images} />
      </CustomTouchable>
    );
  }

  const renderImages = () => {
    if (item.image_urls && item.image_urls.length != 0) {
      const listImage: IImageInfo[] = [
        ...item.image_urls.map(item => ({
          url: item
        }))
      ]
      return (
        <View style={styles.file_image}>
          <CustomText text={`${translate('requests.file_image')}:`} style={styles.titleImage} styleContainer={styles.titleContainers} />
          <CustomFlatList
            onLoad={onLoadImage}
            contentContainerStyle={styles.flatListImages}
            data={listImage}
            horizontal={true}
            renderItem={renderItemImage}
          />
          <ImageViewerCustom
            loading={showImages}
            images={listImage}
            index={idxSelectImage ?? 0}
            onBackdropPress={onBackdropPress} />
        </View>
      )
    } else {
      return null
    }
  }

  const onPressFiles = ({ item }: { item: any; index: number }) => {

    let mimeType = 'application/pdf';
    if (item.type == 'doc') {
      mimeType = 'application/doc';
    } else if (item.type == 'xls') {
      mimeType = 'application/excel'
    } else {
      mimeType = 'application/pdf'
    }
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.select({
      ios: dirs.DocumentDir,
      android: dirs.DocumentDir
    });
    const filePath = dirToSave + '/' + item.name

    if (Platform.OS === "ios") {
      RNFetchBlob.fetch(
        'GET',
        item.url,
      ).then((res) => {
        console.log('one1', res)
        RNFetchBlob.fs.writeFile(filePath, res.data, 'base64').then(() => {
          if (Platform.OS === "ios") {
            RNFetchBlob.ios.openDocument(filePath);
          }
        }).catch((res) => {
          console.log('Download Error: ', res)
        })
      }).catch((errorMessage) => {
        console.log('Download Error: ', errorMessage)
      });
    } else {
      RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          title: item.name,
          description: `An ${item.name} file.`,
          mime: mimeType,
          mediaScannable: true,
          notification: true,
        }
      })
        .fetch('GET', item.url)
        .then((res) => {
          console.log('Download Success: ', res)
        }).catch((res) => {
          console.log('Download Error: ', res)
        })
    }
  }


  const renderItemFile = (item: any, index: number) => {
    let icon = IC_PDF;
    if (item.type == 'doc') {
      icon = IC_WORD
    } else if (item.type == 'xls') {
      icon = IC_EXCEL
    } else {
      icon = IC_PDF
    }

    return (
      <CustomTouchable onPress={() => onPressFiles({ item, index })} style={styles.files}>
        <Image style={styles.iconFiles} source={icon} resizeMode={'stretch'} />
        <CustomText text={item.name} style={styles.textFiles} styleContainer={styles.textFilesContainer} numberOfLines={2} />
      </CustomTouchable>
    );
  }

  const renderFiles = () => {
    if (item.files_list) {
      return (
        <View style={styles.file_image}>
          <CustomText text={`${translate('document.download_file')}:`} style={styles.titleImage} styleContainer={styles.downloadFile} />
          <CustomFlatList
            onLoad={onLoadFile}
            data={item.files_list}
            renderItem={renderItemFile}
          />
        </View>
      )
    } else {
      return null
    }
  }

  const getType = (type: DocumentType) => {
    switch (type) {
      case DocumentType.General:
        return translate('document.general_document')
      case DocumentType.Instruction:
        return translate('document.instruction')
      default:
        return type
    }
  }

  const renderContents = () => {
    const type = getType(item && item.type ? item.type : '')
    const time = formatApiToUI(item && item.modified ? item.modified : '')
    const userName = item && item.creator
      ? getUserName(item.creator.first_name, item.creator.last_name, item.creator.email)
      : ''
    const description = item && item.description ? item.description : ''
    return (
      <View style={styles.containers}>
        <CustomText text={item.title} style={styles.title} styleContainer={styles.titleContainers} />
        <CustomText text={type} style={styles.type} styleContainer={styles.typeContainer} />
        <View style={styles.viewAuthor}>
          <CustomText
            text={translate('document.create_by')}
            style={styles.createBy}
            styleContainer={styles.titleContainers}
          />
          <CustomText
            text={` ${userName}`}
            style={styles.author}
            styleContainer={styles.titleContainers}
          />
          <CustomText
            text={`, ${time}`}
            style={styles.createBy}
            styleContainer={styles.titleContainers}
          />
        </View>
        <CustomText
          numberOfLines={0}
          text={description}
          style={styles.description}
          styleContainer={styles.titleContainers}
        />
        {renderImages()}
        {renderFiles()}
      </View>
    )
  }

  return (
    <Container
      isShowHeader={true}
      isDisplayBackButton={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate('document_detail.navigation_title')}
    >
      <KeyboardAwareScrollView
        bounces={false}>
        {renderContents()}
      </KeyboardAwareScrollView>
    </Container >
  )
}

export default DocumentDetailTenant;
