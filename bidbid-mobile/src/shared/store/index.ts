import { isIOS } from '../devices';
import { Linking } from 'react-native';

export const openInStore = async () => {
  if (isIOS) {
    await Linking.openURL(`https://apps.apple.com/us/app/BidBid App/id1577138683`);
  } else {
    await Linking.openURL(`https://play.google.com/store/apps/details?id=app.bidbid`);
  }
};
