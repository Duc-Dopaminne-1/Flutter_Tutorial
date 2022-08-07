import {BlurView} from '@react-native-community/blur';
import React, {useState} from 'react';
import {AppState, StyleSheet, View} from 'react-native';

import {useMount} from './commonHooks';

const APP_STATE = {
  LOADING: 'unknown',
  BACKGROUND: 'background',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

const WithAppState = WrappedComponent => {
  const [appState, setAppState] = useState(APP_STATE.LOADING);

  useMount(() => {
    // Register listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  });

  function handleAppStateChange(nextAppState) {
    setAppState(nextAppState);
  }

  return (
    <View style={styles.container}>
      <WrappedComponent />
      {appState === APP_STATE.INACTIVE && (
        <BlurView
          style={styles.overlay}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
    </View>
  );
};

export default WithAppState;
