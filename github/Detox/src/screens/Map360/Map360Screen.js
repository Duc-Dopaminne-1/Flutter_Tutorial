import React, {useState} from 'react';
import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import WebView from 'react-native-webview';

import {
  GenerateTopenMapTplAccessTokenMutationVariables,
  GenerateTopenMapTplAccessTokenResponse,
  useGenerateTopenMapTplAccessTokenMutation,
} from '../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {translate} from '../../assets/localize';
import BaseScreen from '../../components/BaseScreen';
import Configs from '../../configs';
import {useMountInteraction} from '../commonHooks';

export const Map360Screen = () => {
  const [tpmToken, setTPMToken] = useState('');

  const {startApi: generateToken} = useMutationGraphql({
    graphqlApiLazy: useGenerateTopenMapTplAccessTokenMutation,
    dataField: 'generateTopenMapTPLAccessToken',
    showSpinner: true,
  });

  useMountInteraction(() => {
    const variables: GenerateTopenMapTplAccessTokenMutationVariables = {
      payload: {
        deviceId: getUniqueId(),
        platform: Platform.OS,
      },
    };
    generateToken({variables}, (response: GenerateTopenMapTplAccessTokenResponse) => {
      const authToken = response?.authToken;
      if (authToken) {
        setTPMToken(authToken);
      }
    });
  });

  return (
    <BaseScreen title={translate('map360.title')} showHeaderShadow={true}>
      {!!tpmToken && (
        <WebView
          source={{uri: Configs.tpm.getURL(tpmToken)}}
          javaScriptEnabled
          startInLoadingState
        />
      )}
    </BaseScreen>
  );
};
