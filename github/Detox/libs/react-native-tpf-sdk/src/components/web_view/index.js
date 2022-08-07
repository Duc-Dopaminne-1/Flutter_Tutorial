import React, { useContext } from 'react';
import { Linking, Platform } from 'react-native';
import themeContext from '../../constants/theme/themeContext';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { CUSTOM_COLOR } from '../../constants/colors';

const generateAssetsFontCss = (
  fontRegularName,
  fontBoldName,
  fontItalicName,
  fileFormat = 'ttf',
  textColor
) => {
  const fileRegularUri = Platform.select({
    ios: `${fontRegularName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontRegularName}.${fileFormat}`
  });
  const fileBoldUri = Platform.select({
    ios: `${fontBoldName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontBoldName}.${fileFormat}`
  });
  const fileItalicUri = Platform.select({
    ios: `${fontBoldName}.${fileFormat}`,
    android: `file:///android_asset/fonts/${fontBoldName}.${fileFormat}`
  });

  return `
	@font-face {
        font-family: '${fontRegularName}';
        src: local('${fontRegularName}'), url('${fileRegularUri}') format('${
    fileFormat === 'ttf' ? 'truetype' : 'opentype'
  }');
	}
	@font-face {
        font-family: '${fontBoldName}';
        src: local('${fontBoldName}'), url('${fileBoldUri}') format('${
    fileFormat === 'ttf' ? 'truetype' : 'opentype'
  }');
	}
	@font-face {
        font-family: '${fontItalicName}';
        src: local('${fontItalicName}'), url('${fileItalicUri}') format('${
    fileFormat === 'ttf' ? 'truetype' : 'opentype'
  }');
	}
  *{
    background-color:${CUSTOM_COLOR.Transparent} !important;
    color: ${textColor} !important
  }
	body {font-family: '${fontRegularName}'}
	h1,strong{font-family: '${fontBoldName}'; color: ${textColor} !important}
	h2,h3,h4,h5 {font-weight: normal;font-family: '${fontRegularName}'; color: ${textColor} !important}
	i{font-family: '${fontItalicName}'; color: ${textColor} !important}
	li{color: ${textColor} !important}
	p{color: ${textColor} !important; margin: 0}
    img {max-width: 100%; height: auto}
    p > img {vertical-align: middle;}
	a{
    color:#06c !important
  }
  .ql-align-justify{
    text-align: justify;
  }
  .ql-align-center{
    text-align: center;
  }
  .ql-align-right{
    text-align: right;
  }
  .ql-align-left{
    text-align: left;
  }
    `;
};
const WebViewCustom = props => {
  const { content, onLayout, width, height } = props;
  const { fonts, text } = useContext(themeContext) || {};
  let htmlView =
    `<html><head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"><style>` +
    generateAssetsFontCss(fonts.REGULAR, fonts.BOLD, fonts.ITALIC, 'ttf', text.primary || 'red') +
    `</style></head><body style="margin: 0;padding: 0;">${content}</body></html>`;
  const handleExternalLink = event => {
    if (event.url.slice(0, 4) === 'http') {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };
  return (
    <AutoHeightWebView
      style={[
        { width, alignSelf: 'center' },
        height ? { height } : {},
        Platform.OS === 'android' && { opacity: 0.99, minHeight: 1 }
      ]}
      source={{ html: htmlView, baseUrl: '' }}
      onSizeUpdated={size => {
        if (size.height > 0 && onLayout) {
          onLayout(size.height);
        }
      }}
      scrollEnabled={false}
      scalesPageToFit={true}
      useWebKit={false}
      scrollEnabledWithZoomedin={false}
      androidHardwareAccelerationDisabled
      androidLayerType="hardware"
      onShouldStartLoadWithRequest={handleExternalLink}
      viewportContent={'width=device-width, user-scalable=no'}
    />
  );
};
export default WebViewCustom;
