import { EVENT_TYPE } from '../constants/analyticEnums';
import CrashlyticsService from '../helpers/CrashlyticsService';
import FirebaseAnalyticsService from '../helpers/FirebaseAnalyticsService';
import { ActionObject } from '../models';
import PropTypes from 'prop-types';
import React, { useLayoutEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { getDeviceName, getModel } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const ScrollViewLayout = ({
  children,
  eventName,
  routeName,
  onTouchEnd,
  onTouchMove,
  onTouchStart,
  componentName,
  iskeyboardAwareScrollView,
  ...rest
}) => {
  const crashlytics = CrashlyticsService.getInstance();
  const analytics = FirebaseAnalyticsService.getInstance();
  const [deviceName, setDeviceName] = useState();
  let coordinate = [];
  const { memberId, topenId } = useSelector(state => state.auth);
  const getDevice = async () => {
    const device = await getDeviceName();
    setDeviceName(device);
  };

  useLayoutEffect(() => {
    getDevice();
  }, []);

  const onTouchStartAnalytics = event => {
    crashlytics.logCrash(eventName || '');

    try {
      // eslint-disable-next-line no-const-assign
      coordinate = [];
      coordinate.push(
        JSON.stringify({
          locationX: event.nativeEvent.locationX,
          locationY: event.nativeEvent.locationY,
          pageX: event.nativeEvent.pageX,
          pageY: event.nativeEvent.pageY
        })
      );
    } catch (error) {
      crashlytics.errorRecord(error);
    }
  };

  const onTouchMoveAnalytics = event => {
    crashlytics.logCrash(eventName || '');

    try {
      coordinate.push(
        JSON.stringify({
          locationX: event.nativeEvent.locationX,
          locationY: event.nativeEvent.locationY,
          pageX: event.nativeEvent.pageX,
          pageY: event.nativeEvent.pageY
        })
      );
    } catch (error) {
      crashlytics.errorRecord(error);
    }
  };

  const onTouchEndAnalytics = event => {
    crashlytics.logCrash(eventName || '');

    try {
      coordinate.push(
        JSON.stringify({
          locationX: event.nativeEvent.locationX,
          locationY: event.nativeEvent.locationY,
          pageX: event.nativeEvent.pageX,
          pageY: event.nativeEvent.pageY
        })
      );

      const actionObj = new ActionObject({
        route_name: routeName || '',
        event_name: eventName || '',
        component: componentName || '',
        coordinate,
        topenId,
        deviceName: `${getModel()}-${deviceName}`
      });
      analytics.logEvent(EVENT_TYPE.SCROLL_VIEW, actionObj);
    } catch (error) {
      crashlytics.errorRecord(error);
    }
  };

  if (iskeyboardAwareScrollView) {
    return (
      <KeyboardAwareScrollView
        onTouchStart={onTouchStartAnalytics}
        onTouchMove={onTouchMoveAnalytics}
        onTouchEnd={onTouchEndAnalytics}
        {...rest}>
        {children}
      </KeyboardAwareScrollView>
    );
  }

  return (
    <ScrollView
      onTouchStart={onTouchStartAnalytics}
      onTouchMove={onTouchMoveAnalytics}
      onTouchEnd={onTouchEndAnalytics}
      {...rest}>
      {children}
    </ScrollView>
  );
};

ScrollViewLayout.propTypes = {
  children: PropTypes.any,
  onTouchEnd: PropTypes.func,
  onTouchMove: PropTypes.func,
  eventName: PropTypes.string,
  routeName: PropTypes.string,
  onTouchStart: PropTypes.func,
  componentName: PropTypes.string,
  iskeyboardAwareScrollView: PropTypes.bool
};

ScrollViewLayout.defaultProps = {
  iskeyboardAwareScrollView: false
};

export default ScrollViewLayout;
