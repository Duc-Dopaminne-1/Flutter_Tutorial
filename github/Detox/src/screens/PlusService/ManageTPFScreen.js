import React from 'react';
import WebView from 'react-native-webview';

import PageScreen from '../../components/PageScreen';
import {getConfigs} from '../../configs';

const TPF_PORTAL = getConfigs().tpf.PORTAL;

const ManageTPFScreen = () => {
  return (
    <PageScreen>
      <WebView source={{uri: TPF_PORTAL}} javaScriptEnabled={true} scalesPageToFit={false} />
    </PageScreen>
  );
};

export default ManageTPFScreen;
