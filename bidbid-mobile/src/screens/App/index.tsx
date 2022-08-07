import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppInit } from '@/redux/app/reducer';
import { useNavigation } from '@react-navigation/native';
import NavigationActionsService from '@/navigation/navigation';
import { AppActionType } from '@/redux/app';
import { init } from '@/redux/app/actions';
import SplashScreen from 'react-native-splash-screen';
import InitScreen from '@/screens/App/SplashScreen';

export const App: () => JSX.Element = () => {
  const appStatus = useSelector((state: AppInit) => state.app.status);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
      NavigationActionsService.startTime = performance.now();
    }, 200);
    NavigationActionsService.initInstance(navigation, dispatch);
  }, []);

  useEffect(() => {
    switch (appStatus) {
      case AppActionType.MOUNTED:
        NavigationActionsService.dispatchAction(init());
        break;
      case AppActionType.INITED:
        NavigationActionsService.getInitApp();
        break;
    }
  }, [appStatus]);

  return <InitScreen />;
};
