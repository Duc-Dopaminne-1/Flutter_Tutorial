import AnalyticsService from './AnalyticsService';
// import analytics from '@react-native-firebase/analytics';

export default class FirebaseAnalyticsService extends AnalyticsService {
  instance = null;

  static getInstance() {
    if (this.instance == null) {
      this.instance = new FirebaseAnalyticsService();
    }
    return this.instance;
  }

  async clearUser() {
    // await analytics().setUserId(null);
  }

  async logEvent(key, params) {
    // await analytics().logEvent(key, params);
  }

  async setUserId(params) {
    // await analytics().setUserId(params);
  }

  async logPage(params) {
    // await analytics().logEvent('page_event', params);
  }

  async logAction(params) {
    // await analytics().logEvent('user_action', params);
  }

  async logPageDuration(params) {
    // await analytics().logEvent('page_time_duration', params);
  }

  async logTapGesture(params) {
    // await analytics().logEvent('gesture_tap', params);
  }

  async logPanGesture(params) {
    // await analytics().logEvent('gesture_pan', params);
  }

  async logSwipeGesture(params) {
    // await analytics().logEvent('gesture_pan', params);
  }
}
