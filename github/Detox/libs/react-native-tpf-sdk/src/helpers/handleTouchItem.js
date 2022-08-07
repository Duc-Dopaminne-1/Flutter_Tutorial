// import { EVENT_TYPE } from 'constants/analyticEnums';
// import CrashlyticsService from 'helpers/CrashlyticsService';
// import FirebaseAnalyticsService from 'helpers/FirebaseAnalyticsService';
// import { getModel, getDeviceName } from 'react-native-device-info';
// import { ItemActionObject } from 'src/models/ActionObject';
// import AppsFlyerService from './AppsFlyerService';

// const crashlytics = CrashlyticsService.getInstance();
// const analytics = FirebaseAnalyticsService.getInstance();
// const appsFlyer = AppsFlyerService.getInstance();

export const handleTouchItem = async (event, component, route, item, topenId) => {
  // // const coordinate = [
  // //   JSON.stringify({
  // //     locationX: event.nativeEvent?.locationX,
  // //     locationY: event.nativeEvent?.locationY,
  // //     pageX: event.nativeEvent?.pageX,
  // //     pageY: event.nativeEvent?.pageY
  // //   })
  // // ];
  // const deviceName = await getDeviceName();
  // const _item = {};
  // if (item?.id) {
  //   _item.id = item.id;
  // }
  // if (item?.categoryDetailId || item?.categoryId) {
  //   _item.categoryId = item?.categoryDetailId || item?.categoryId;
  // }
  // if (item?.isHighlight) {
  //   _item.typeFilter = JSON.stringify({ isHighlight: true });
  // }
  // if (item?.status) {
  //   _item.status = item.status;
  // }
  // try {
  //   crashlytics.logCrash(component);
  //   let actionObj = new ItemActionObject({
  //     route_name: route?.name || '',
  //     event_name: EVENT_TYPE.ITEM_TOUCH,
  //     component,
  //     // coordinate: coordinate.toString(),
  //     item: JSON.stringify(_item),
  //     topenId,
  //     deviceName: `${getModel()}-${deviceName}`
  //   });
  //   analytics.logAction(actionObj);
  //
  //   analytics.logEvent(EVENT_TYPE.ITEM_TOUCH, actionObj);
  //   appsFlyer.logEvent(EVENT_TYPE.ITEM_TOUCH, actionObj);
  // } catch (error) {
  //   crashlytics.errorRecord(error);
  // }
};
