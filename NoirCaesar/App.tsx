/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { SafeAreaView, StatusBar, Platform } from 'react-native';
import React from 'react';

const App = () => {
  return (
    <>
      {Platform.OS === 'ios' ? <StatusBar barStyle="dark-content" /> : undefined}
      <SafeAreaView />
    </>
  );
};

export default App;
