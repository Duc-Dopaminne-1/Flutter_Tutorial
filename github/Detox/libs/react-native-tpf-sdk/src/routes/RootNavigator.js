import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import React, { Suspense, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrivacyPolicyHandle,
  getTermAndConditionListHandle
} from '../redux/actions/termAndCodition';

import Indicator from '../components/circle_indicator';
import ErrorBoundary from '../components/error_boundary';
import { CUSTOM_COLOR } from '../constants/colors';
import AppNavigator from './AppNavigator';

const RootNavigator = ({ onLoaded }, ref) => {
  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();
  const sdkState = useSelector(state => state.middleware.state);
  const sdkStyle = sdkState === 'hide' ? styles.containerHide : styles.containerShow;

  const style =
    sdkState === 'hide'
      ? {
          flex: 0
        }
      : {
          height: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        };

  useEffect(() => {
    dispatch(getTermAndConditionListHandle({ includeContent: true }));
    dispatch(getPrivacyPolicyHandle({ includeContent: true }));
  }, [dispatch]);
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={sdkStyle}>
        <Suspense
          fallback={
            <View style={styles.fallback}>
              <Indicator />
            </View>
          }>
          <>
            <SafeAreaView style={style} edges={['top']} />
            <SafeAreaProvider>
              <ErrorBoundary>
                <AppNavigator onLoaded={onLoaded} ref={ref} />
              </ErrorBoundary>
            </SafeAreaProvider>
            <SafeAreaView
              style={{
                flex: 0
              }}
              edges={['bottom']}
            />
          </>
        </Suspense>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fallback: {
    // flex: 1,
    backgroundColor: CUSTOM_COLOR.White
  },
  containerShow: {
    height: '100%'
  },
  containerHide: {
    position: 'absolute',
    bottom: -1,
    height: 1
  }
});

export default React.forwardRef(RootNavigator);
