/* eslint-disable react-native/no-inline-styles */
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import React from 'react';
import {Text} from 'react-native';

import {CaptureScrollViewContent} from './CaptureScrollViewContent';
import {StoryConfig} from './StoryConfig';

const client = new ApolloClient({
  fetch: null,
  fetchOptions: {
    credentials: 'include',
  },
  link: 'link',
  cache: new InMemoryCache(),
});

const WithApollo = ({config, children}) => {
  if (config?.isHaveApolloNetwork) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  } else {
    return <>{children}</>;
  }
};

export const configDecorator = (config: StoryConfig) => Story => {
  return (
    <WithApollo config={config}>
      <>
        <Text style={{display: 'none'}} testID="storyConfigId">
          {JSON.stringify(config)}
        </Text>
        {config.isCaptureScrollViewContent ? (
          <CaptureScrollViewContent>
            <Story />
          </CaptureScrollViewContent>
        ) : (
          <Story />
        )}
      </>
    </WithApollo>
  );
};
