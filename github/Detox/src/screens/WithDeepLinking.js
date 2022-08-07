import get from 'lodash/get';
import React, {useContext, useEffect} from 'react';
import {Linking} from 'react-native';
import DeepLinking from 'react-native-deep-linking';

import {AppContext} from '../appData/appContext/useAppContext';
import Configs from '../configs';
import logService from '../service/logService';
import UrlUtils from '../utils/UrlUtils';
import {useLogin} from './Auth/useLogin';
import {callAfterInteraction} from './commonHooks';
import {rootNavigationRef} from './navigate';
import ScreenIds from './ScreenIds';
import {TransactionType} from './Transaction/DetailTransaction/Components/DetailTransactionConstant';

export function handleUrl(url) {
  if (!url) {
    return;
  }

  //handle for relative url if needed
  const evaluatedUrl = UrlUtils.getAbsoluteUrl(url);
  Linking.canOpenURL(evaluatedUrl)
    .then(supported => {
      if (supported) {
        DeepLinking.evaluateUrl(evaluatedUrl);
      }
    })
    .catch(error => {
      logService.log(error); //ignore error
    });
}

const WithDeepLinking = WrappedComponent => {
  const {setLaunchUrl, clearLaunchUrl, getIsLoggedIn, getIsAppLoaded} = useContext(AppContext);
  const {showLogin} = useLogin();
  useEffect(() => {
    // Register schemes
    const appScheme = Configs.deepLinking.DEEP_LINKING_APP_SCHEME;
    const webScheme = Configs.deepLinking.DEEP_LINKING_WEB_SCHEME;
    const portalScheme = Configs.portal.PORTAL_URL;
    DeepLinking.addScheme(`${appScheme}://`);
    DeepLinking.addScheme(`${webScheme}://`);
    DeepLinking.addScheme(portalScheme);
    // Add event listener
    const linkingEvent = Linking.addEventListener('url', handleUrlListener);
    const handleDeepLinkingInfo = (info = {}) => {
      const {screenId, params, isRequireLogin = false} = info;
      logService.log('handleDeepLinkingInfo===', info);
      // only navigate to specific screen for logged in user
      callAfterInteraction(() => {
        if (isRequireLogin) {
          showLogin(() => {
            rootNavigationRef.current?.navigate(screenId, params);
          });
        } else {
          rootNavigationRef.current?.navigate(screenId, params);
        } // NOSONAR due to wrong parsing of sonar scanner for this optional operation
      });
    };
    //Register routes
    DeepLinking.addRoute('/project/:id', response => {
      const projectId = response?.id;
      handleDeepLinkingInfo({
        screenId: ScreenIds.ProjectDetail,
        params: {projectId: projectId ?? ''},
      });
    });

    DeepLinking.addRoute('/invitation/:code', response => {
      const inviteCode = response?.code;
      if (getIsLoggedIn()) {
        handleDeepLinkingInfo({
          screenId: ScreenIds.BasicProfileNavigation,
          params: {inviteCode: inviteCode ?? ''},
        });
      } else {
        handleDeepLinkingInfo({
          screenId: ScreenIds.AuthStack,
          params: {screen: ScreenIds.InputMobile, params: {inviteCode: inviteCode ?? ''}},
        });
        clearLaunchUrl();
      }
    });

    DeepLinking.addRoute('/post/:id', response => {
      const propertyPostId = response?.id;
      handleDeepLinkingInfo({
        screenId: ScreenIds.ViewPropertyPost,
        params: {propertyPostId: propertyPostId ?? '', viewByOtherMode: true},
      });
    });

    DeepLinking.addRoute('contact-trading/received/:id', response => {
      const contactTradingId = response?.id;
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.RequestDetailStack,
        params: {
          screen: ScreenIds.RequestDetail,
          params: {
            requestId: contactTradingId ?? '',
            isSending: false,
          },
        },
      });
    });

    DeepLinking.addRoute('request-support/detail/:id', response => {
      const requestSupportId = response?.id;
      handleDeepLinkingInfo({
        screenId: ScreenIds.DetailContactAdvice,
        params: {
          id: requestSupportId,
        },
      });
    });

    DeepLinking.addRoute(RegExp('/agent/edit-profile$'), () => {
      handleDeepLinkingInfo({
        screenId: ScreenIds.BasicProfileNavigation,
      });
    });

    DeepLinking.addRoute('/account/topener-support-requests/:id', response => {
      const supportRequestId = response?.id;
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.DetailRequestSupport,
        params: {
          ticketId: supportRequestId,
          isRequest: true,
        },
      });
    });

    DeepLinking.addRoute('contact-trading/sent/:id', response => {
      const contactTradingId = response?.id;
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.RequestDetailStack,
        params: {
          screen: ScreenIds.RequestDetail,
          params: {
            requestId: contactTradingId ?? '',
            isSending: true,
          },
        },
      });
    });

    DeepLinking.addRoute('contact-trading-b2c/sent/:id', response => {
      const contactTradingId = response?.id;
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.RequestDetailStack,
        params: {
          screen: ScreenIds.RequestDetail,
          params: {
            requestId: contactTradingId,
            isSending: true,
            isB2C: true,
          },
        },
      });
    });

    DeepLinking.addRoute('/account/transaction/:id/booking:propertyId', response => {
      const transactionId = response?.id;
      const transactionType = TransactionType.Booking;
      const propertyPostId = get(response.propertyId.split('='), '[1]', '');
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.DetailTransaction,
        params: {
          transactionId: transactionId ?? '',
          propertyPostId: propertyPostId,
          transactionType: transactionType ?? '',
        },
      });
    });

    DeepLinking.addRoute('/account/transaction/:id/deposit:propertyId', response => {
      const transactionId = response?.id;
      const transactionType = TransactionType.Deposit;
      const propertyPostId = get(response.propertyId.split('='), '[1]', '');
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.DetailTransaction,
        params: {
          transactionId: transactionId ?? '',
          propertyPostId: propertyPostId,
          transactionType: transactionType ?? '',
        },
      });
    });

    DeepLinking.addRoute('/profile/my-post/:id', response => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.ViewPropertyPost,
        params: {
          propertyPostId: response?.id,
          viewByOtherMode: false,
        },
      });
    });

    DeepLinking.addRoute(RegExp('/profile/saved-post$'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.PropertyPostSaved, isRequireLogin: true});
    });

    DeepLinking.addRoute(RegExp('/notification$'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.Notification, isRequireLogin: true});
    });
    DeepLinking.addRoute(RegExp('/contact-trading-b2c$'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.Notification, isRequireLogin: true});
    });

    DeepLinking.addRoute(RegExp('/account/pay-subscription$'), () => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.SubscriptionStack,
        params: {
          screenId: ScreenIds.SubscriptionInfo,
          params: {},
        },
      });
    });

    DeepLinking.addRoute(RegExp('/profile/assigned-project-post$'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.ProjectDelivered, isRequireLogin: true});
    });
    DeepLinking.addRoute('/project/property/:id', response => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.ViewProperty,
        params: {propertyPostId: response?.id},
      });
    });
    DeepLinking.addRoute(RegExp('/account/transaction$'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.Transaction});
    });
    DeepLinking.addRoute('/account/transaction/:id/evaluate/booking', response => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.ReviewAgent,
        params: {transactionId: response?.id ?? '', transactionType: TransactionType.Booking},
      });
    });
    DeepLinking.addRoute('/account/transaction/:id/evaluate/deposit', response => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.ReviewAgent,
        params: {transactionId: response?.id ?? '', transactionType: TransactionType.Deposit},
      });
    });
    DeepLinking.addRoute('/rate/:id', response => {
      handleDeepLinkingInfo({
        isRequireLogin: true,
        screenId: ScreenIds.ReviewSupportRequestAgent,
        params: {supportRequestId: response?.id},
      });
    });
    DeepLinking.addRoute(RegExp('/profile/suggest-post'), () => {
      handleDeepLinkingInfo({screenId: ScreenIds.SuggestionPost, isRequireLogin: true, params: {}});
    });
    DeepLinking.addRoute(RegExp('/profile/allocated-post'), () => {
      handleDeepLinkingInfo({
        screenId: ScreenIds.PropertyPostCrawler,
        isRequireLogin: true,
        params: {},
      });
    });

    DeepLinking.addRoute('/chi-tiet/du-an/:id', response => {
      const projectId = response?.id;
      handleDeepLinkingInfo({
        screenId: ScreenIds.ProjectDetail,
        isRequireLogin: true,
        params: {projectId: projectId},
      });
    });
    return () => {
      linkingEvent.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleUrlListener(urlInfo) {
    logService.log('handleUrlListener===urlInfo', urlInfo);
    const {url} = urlInfo;

    if (getIsAppLoaded()) {
      if (getIsLoggedIn()) {
        clearLaunchUrl();
      } else {
        setLaunchUrl(url);
      }
    } else {
      setLaunchUrl(url);
    }
    handleUrl(url);
  }

  return <WrappedComponent />;
};

export default WithDeepLinking;
