import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';

import {AppProvider} from '../../src/appData/appContext/useAppContext';
import {store} from '../../src/appData/store';

export const appProviderDecorator = storyFn => (
  <ReduxProvider store={store}>
    <AppProvider>{storyFn()}</AppProvider>
  </ReduxProvider>
);
