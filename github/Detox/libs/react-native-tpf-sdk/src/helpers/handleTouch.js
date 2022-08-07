// import CrashlyticsService from '../helpers/CrashlyticsService';
// import FirebaseAnalyticsService from '../helpers/FirebaseAnalyticsService';
// import AppsFlyerService from './AppsFlyerService';
// import { EVENT_TYPE } from '../constants/analyticEnums';
// import { getModel, getDeviceName } from 'react-native-device-info';
// import { ActionObject } from '../models/ActionObject';

// const crashlytics = CrashlyticsService.getInstance();
// const analytics = FirebaseAnalyticsService.getInstance();
// const appsFlyer = AppsFlyerService.getInstance();

export const handleTouch = async (event, componentName, route, topenId, eventType) => {
  // // const coordinate = [
  // //   JSON.stringify({
  // //     locationX: event.nativeEvent?.locationX,
  // //     locationY: event.nativeEvent?.locationY,
  // //     pageX: event.nativeEvent?.pageX,
  // //     pageY: event.nativeEvent?.pageY
  // //   })
  // // ];
  // const deviceName = await getDeviceName();
  // try {
  //   crashlytics.logCrash(componentName);
  //   let actionObj = new ActionObject({
  //     route_name: route?.name || '',
  //     event_name: eventType || EVENT_TYPE.BUTTON_TOUCH,
  //     component: componentName,
  //     // coordinate: coordinate.toString(),
  //     topenId,
  //     deviceName: `${getModel()}-${deviceName}`
  //   });
  //   analytics.logEvent(eventType || EVENT_TYPE.BUTTON_TOUCH, actionObj);
  //   appsFlyer.logEvent(eventType || EVENT_TYPE.BUTTON_TOUCH, actionObj);
  // } catch (error) {
  //   crashlytics.errorRecord(error);
  // }
};
