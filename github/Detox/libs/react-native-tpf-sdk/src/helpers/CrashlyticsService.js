import AnalyticsService from './AnalyticsService';
// import crashlytics from '@react-native-firebase/crashlytics';

export default class CrashlyticsService extends AnalyticsService {
  instance = null;

  static getInstance() {
    if (this.instance == null) {
      this.instance = new CrashlyticsService();
    }
    return this.instance;
  }

  logCrash(text) {
    // crashlytics().log(text);
  }

  errorRecord(error) {
    // crashlytics().recordError(error);
  }

  setAttributes(params) {
    // crashlytics().setAttributes(params);
  }
}
