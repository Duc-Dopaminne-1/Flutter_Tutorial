import { Platform } from "react-native";
import Config from "react-native-config";

export const ENVIRONMENT = Config.ENVIRONMENT;

export const ONESIGNAL_APP_ID = Config.ONESIGNAL_APP_ID;

export const GOOGLE_API_KEY = Platform.select({
  ios: Config.GOOGLE_API_KEY_IOS,
  android: Config.GOOGLE_API_KEY_ANDROID,
});

export const GOOGLE_WEB_CLIENT_ID = Config.GOOGLE_WEB_CLIENT_ID;

export const API_BASE_URL = Config.API_BASE_URL;

export const TWITTER_CONSUMER_KEY = Config.TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = Config.TWITTER_CONSUMER_SECRET;

console.log("=====> ENV " + ENVIRONMENT);
