import './rn-addons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';
import {addDecorator, addParameters, configure, getStorybookUI} from '@storybook/react-native';
import React from 'react';
import {LogBox, StatusBar} from 'react-native';

import {loadStories} from './storyLoader';

LogBox.ignoreAllLogs(true);

configure(() => {
  loadStories();
}, module);

addDecorator(withBackgrounds);
addDecorator(Story => (
  <>
    <StatusBar hidden />
    <Story />
  </>
));

addParameters({
  options: {
    // storySort: (a, b) =>
    //   a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, {numeric: true}),
    // storySort: {
    //   method: 'alphabetical',
    // },
    backgrounds: [
      {name: 'dark', value: '#222222'},
      {name: 'white', value: '#ffffff', default: true},
    ],
  },
});

const StorybookUIRoot = getStorybookUI({
  // host: DebugConfig.devHost,
  isUIHidden: true,
  asyncStorage: AsyncStorage,
  disableWebsockets: false,
});

export default StorybookUIRoot;
