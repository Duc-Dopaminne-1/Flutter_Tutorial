import isEmpty from 'lodash/isEmpty';
import React, {Fragment} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {METRICS} from '../../assets/theme/metric';
import DocumentItem from '../../components/DocumentItem';
import LinkTextButton from '../../components/LinkTextButton';
import MapSection from '../../components/MapSection';
import ImageSlider from '../../components/Slider/ImageSlider';
import TextView from '../../components/TextView';
import {extractFileName, urlsToSources} from '../../utils/DataProcessUtil';
import {downloadFileAzure} from '../../utils/fileHandler';
import {redirectToURL} from '../../utils/UiUtils';
import {HTMLText} from './components/HTMLText';
import styles from './styles';

const getDocumentList = (urlList, onItemPress, withBackground) => {
  const documentsView = urlList.map(it => (
    <DocumentItem
      key={extractFileName(it.url)}
      name={extractFileName(it.url)}
      onPress={() => onItemPress(it.url, it?.name || extractFileName(it.url))}
    />
  ));

  return withBackground ? (
    <View style={styles.documentContainer}>
      {documentsView.map((e, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={styles.separatorWhite} />}
          {e}
        </Fragment>
      ))}
    </View>
  ) : (
    documentsView
  );
};

const initialState = {
  images: [],
  document: [],
  streetview: '',
  threedview: '',
  video: '',
  description: '',
  mapview: '',
};

const AddressHorizontalInfoCell = ({value, onPress = () => {}}) => {
  return (
    <View style={styles.cellHorizontal}>
      <LinkTextButton
        style={styles.cellValueHorizontalAddressView}
        textStyle={styles.cellValueHorizontalAddress}
        onPress={onPress}
        title={value}
        rightIcon={
          <Image
            source={IMAGES.ARROW_RIGHT_LINEAR}
            style={styles.addressIconRight}
            resizeMode="contain"
          />
        }
      />
    </View>
  );
};

const DocumentsView = ({documents = []}) => {
  const onDownLoadDocument = async (url, fileName) => {
    await downloadFileAzure(url, fileName);
  };

  if (!documents || documents?.length <= 0) {
    return null;
  }

  return (
    <View style={METRICS.smallMarginBottom}>
      {getDocumentList(documents, onDownLoadDocument, true)}
    </View>
  );
};

const ProjectSection = ({title, sectionData = initialState, address, isTesting}) => {
  const {description, images, documents, mapview} = sectionData;
  if (
    (isEmpty(description) || description === 'null') &&
    !mapview?.latitude &&
    !mapview?.longitude &&
    isEmpty(images) &&
    isEmpty(documents)
  ) {
    return null;
  }

  const onPressAddress = (coordinates, viewAddress) => {
    const {longitude, latitude} = coordinates;
    const url = Platform.select({
      ios: `maps:0,0?q=${viewAddress}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${viewAddress})`,
    });
    redirectToURL(url);
  };

  const onPressDownloadAll = () => {};

  const showDownloadButton = title === translate('project.detail.sections.saleProgram');

  return (
    <>
      <View style={styles.projectSectionSeparator} />
      <View key={title} style={styles.sectionContainer}>
        <TextView
          title={title}
          titleStyle={styles.textProjectSection}
          containerStyle={styles.projectSectionTitleContainer}
          customRightComponent={
            showDownloadButton && (
              <TouchableOpacity onPress={onPressDownloadAll}>
                <Text style={styles.textProjectSectionDescription}>
                  {translate('common.downloadAll')}
                </Text>
              </TouchableOpacity>
            )
          }
          valueStyle={styles.textProjectSectionDescription}
        />
        {!!(mapview?.latitude && mapview.longitude && !isTesting) && (
          <View style={METRICS.smallMarginBottom}>
            <MapSection
              style={styles.viewMap}
              regionState={mapview}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
            />
            <AddressHorizontalInfoCell
              value={address}
              onPress={() => onPressAddress(mapview, address)}
            />
          </View>
        )}
        <View style={METRICS.horizontalPadding}>
          {!isEmpty(description) && description !== 'null' && (
            <View style={METRICS.smallMarginBottom}>
              <HTMLText text={description} />
            </View>
          )}

          <DocumentsView documents={documents} />

          {!isEmpty(images) && (
            <ImageSlider
              images={urlsToSources(images)}
              containerStyle={styles.sectionImageStyle}
              imageContainerStyle={styles.sectionImageStyle}
              isTesting={isTesting}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default ProjectSection;
