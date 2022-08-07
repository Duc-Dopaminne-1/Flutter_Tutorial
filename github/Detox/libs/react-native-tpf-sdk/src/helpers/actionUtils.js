import { Linking } from 'react-native';

export default class ActionUtils {
  static onLocation = ({ address }) => {
    const location = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.canOpenURL(location)
      .then(supported => {
        if (!supported) {
        } else {
          return Linking.openURL(location);
        }
      })
      .catch(err => {});
  };

  static onCall = ({ phone, callback, onError }) => {
    const params = `tel:${phone}`;
    Linking.canOpenURL(params)
      .then(supported => {
        if (!supported) {
          onError ? onError() : null;
        } else {
          //create history action: call
          callback ? callback() : null;
          return Linking.openURL(params);
        }
      })
      .catch(err => {});
  };

  static onEmail = ({ email, subject, body, callback, onError }) => {
    // const { cc, bcc } = options;
    if (email) {
      let url = `mailto:${email}`;

      // // Create email link query
      // const query = JSON.stringify({
      //   subject: subject,
      //   body: body
      // });

      // if (query.length) {
      //   url += `?${query}`;
      // }

      // check if we can use this link
      const canOpen = Linking.canOpenURL(url);

      if (!canOpen) {
        throw new Error('Provided URL can not be handled');
      }
      //create history action: sendEmail
      if (callback) {
        callback();
      }
      return Linking.openURL(url);
    } else {
      onError ? onError() : null;
    }
  };
}
