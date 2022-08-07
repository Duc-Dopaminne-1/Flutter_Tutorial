import React from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { StackRootManager } from '@/navigation';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ReactNativeFiberHostComponent',
  'VirtualizedLists should never be nested',
]);

const AppWithStore = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StackRootManager />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

const AppWithStoreCodePush = codePush(AppWithStore);
export default AppWithStoreCodePush;
