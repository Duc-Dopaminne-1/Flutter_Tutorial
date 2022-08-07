import React from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});

const MatterPortWebView = ({link}) => {
  return (
    <WebView
      style={styles.webView}
      javaScriptEnabled
      allowUniversalAccessFromFileURLs
      allowFileAccessFromFileURLs
      source={{uri: link}}
    />
  );
};

export default MatterPortWebView;
