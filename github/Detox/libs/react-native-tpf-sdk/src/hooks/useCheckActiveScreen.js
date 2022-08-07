import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { AppState, DeviceEventEmitter, Platform } from 'react-native';
import SCREENS_NAME from '../constants/screens';

const useCheckActiveScreen = (navigation, localPIN) => {
  const appState = useRef(AppState.currentState);
  const time = useRef(moment());
  const a = useRef(0);
  const b = useRef(0);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription =
      Platform.OS === 'android'
        ? DeviceEventEmitter.addListener('ActivityStateChange', e => {
            appState.current = e.event;
            if (e.event === 'locked') {
              if (localPIN) {
                navigation.navigate(SCREENS_NAME.LOGIN_WITH_PINCODE);
              }
            }

            setAppStateVisible(appState.current);
          })
        : AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            if (nextAppState === 'inactive') {
              // not trigger on android.
              a.current = new Date();
            }

            if (nextAppState === 'background') {
              b.current = new Date();
              const period = b.current - a.current;
              if (period < 110 && localPIN) {
                navigation.navigate(SCREENS_NAME.LOGIN_WITH_PINCODE);
              }
            }

            if (nextAppState === 'active') {
              a.current = 0;
              b.current = 0;
            }

            setAppStateVisible(appState.current);
          });

    return () => {
      subscription?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (appStateVisible === 'inactive') {
      time.current = moment();
    }

    if (appStateVisible === 'active') {
      if (localPIN) {
        const now = moment();
        const duration = moment.duration(now.diff(time.current));
        if (duration.asMinutes() >= 5) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: SCREENS_NAME.LOGIN_WITH_PINCODE
              }
            ]
          });
        }

        return;
      }
    }
  }, [appStateVisible, navigation]);

  return null;
};

export default useCheckActiveScreen;
