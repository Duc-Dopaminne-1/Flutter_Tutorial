import {Platform} from 'react-native';

export const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

export const USER_AGENT_VALUATION =
  Platform.OS === 'android' ? '__AndroidWebView__' : '__IOSWebView__';

export const ValuationSendRequestsToContainer = {
  SEND_DATA_CREATE_POST_TO_OUTSIDE: 'valuation-send-data-create-post-to-outside',
  SEND_EVENT_TO_CLOSE_IFRAME: 'valuation-send-event-to-close-iframe',
  SEND_EVENT_TO_CHECK_AUTHENTICATED: 'valuation-send-event-to-check-authenticated',
  SENT_EVENT_TO_REQUEST_INITIAL_DATA: 'valuation-send-event-to-request-initial-data',
};

export const ValuationSentRequestsToFrame = {
  SEND_INITIAL_DATA_TO_IFRAME: 'valuation-send-initial-data-to-iframe',
};
