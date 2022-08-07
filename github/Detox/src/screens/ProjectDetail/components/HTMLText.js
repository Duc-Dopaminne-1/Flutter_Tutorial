import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';

import {SIZES} from '../../../assets/constants/sizes';
import {HELPERS} from '../../../assets/theme/helpers';
import {sanitizeHtmlText} from '../../../utils/HTMLEntities';
import {testProps} from '../../../utils/testProps';

export const generateAssetsFontCss = ({
  fontFileName = 'Nunito-Regular',
  fileFormat = 'ttf',
  customStyle = '',
}) => {
  const fileUri = Platform.select({
    ios: `${fontFileName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontFileName}.${fileFormat}`,
  });

  return `
  @font-face {
    font-family: '${fontFileName}';
    src: local('${fontFileName}'), url('${fileUri}');
  }
  body {
    font-family: ${fontFileName};
    font-size: ${SIZES.FONT_16}px;
    line-height: ${SIZES.FONT_16_LINE_HEIGHT}px;
  }
  .content {
    font-family: ${fontFileName};
    font-size: ${SIZES.FONT_16}px;
    line-height: ${SIZES.FONT_16_LINE_HEIGHT}px;
  }
  ${customStyle}`;
};

const MapObject = {
  '<p></p>': '<br>', // break line format
  '255,255,255': '249,250,251', // background color
};

const formatHtml = rawData => {
  const regex = new RegExp(Object.keys(MapObject).join('|'), 'gi');
  const formattedHtml = rawData.replace(regex, matched => MapObject[matched]);
  const sanitizedHtml = sanitizeHtmlText(formattedHtml);

  return sanitizedHtml;
};

export const HTMLText = ({text, customStyle}) => {
  const [descriptionHeight, setHeight] = useState(0);
  const webviewRef = useRef(null);
  const onSizeUpdated = size => {
    if (size.height !== descriptionHeight) {
      setHeight(size.height);
    }
  };
  return (
    <View
      {...testProps(descriptionHeight > 0 ? 'isHtmlLoaded' : 'isHtmlLoading')}
      style={{height: descriptionHeight}}>
      <AutoHeightWebView
        customStyle={generateAssetsFontCss({customStyle})}
        viewportContent={'width=device-width, user-scalable=no'}
        ref={webviewRef}
        style={[HELPERS.fullWidth, styles.webview]}
        scrollEnabled={false}
        onSizeUpdated={onSizeUpdated}
        source={{
          baseUrl: '',
          html: formatHtml(text),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {opacity: 0.99, flex: 1, minHeight: 200},
});
