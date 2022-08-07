import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {ApolloLink, concat, Observable} from 'apollo-link';
import {onError} from 'apollo-link-error';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import {getAppLanguage} from '../../appData/appSettings/selectors';
import {
  getAccessToken,
  getRefreshToken,
} from '../../appData/authState/selectors';
import {store} from '../../appData/store';
import {getLanguageCode, translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import Configs from '../../configs';
import logService, {logGraphql} from '../../service/logService';
import {
  handleUnAuthorizedRequest,
  refreshTokens,
  storeTokenResponse,
} from '../authApi';

const getNewTokens = async () => {
  const state = store.getState();
  const refreshToken = getRefreshToken(state);
  const refreshResponse = refreshTokens(refreshToken);

  if (refreshResponse?.isSuccess) {
    const storedTokens = await storeTokenResponse(refreshResponse);
    return {isSuccess: true, data: storedTokens};
  } else {
    await handleUnAuthorizedRequest();
    return {isSuccess: false};
  }
};

const promiseToObservable = promise => {
  return new Observable(subscriber => {
    promise.then(
      value => {
        if (subscriber.closed) {
          return;
        }
        subscriber.next(value);
        subscriber.complete();
      },
      err => {
        subscriber.error(err);
      },
    );
    return subscriber;
  });
};

const getAuthorization = accessToken => {
  if (isEmpty(accessToken)) {
    return {};
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    logService.log(
      'errorLink graphqlErrors===',
      graphQLErrors,
      operation.operationName,
    );
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err?.extensions?.code) {
          case 'AUTH_NOT_AUTHORIZED':
          case 'AUTH_NOT_AUTHENTICATED': //AUTH_NOT_AUTHENTICATED
            // error code is set to UNAUTHENTICATED
            // when AuthenticationError thrown in resolver
            logService.log('UNAUTHENTICATED================');
            return promiseToObservable(getNewTokens()).flatMap(storedTokens => {
              if (!storedTokens?.isSuccess) {
                return new Observable(subscriber =>
                  subscriber.error(
                    new Error(translate(Message.NTW_UNKNOWN_ERROR)),
                  ),
                );
              }

              const {authState} = storedTokens.data ?? {};
              const oldHeaders = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  ...getAuthorization(authState.accessToken),
                },
              });

              return forward(operation);
            });
        }
      }
    }
    if (networkError) {
      // console.log(`[Network error]: ${networkError}`);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
  },
);

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const state = store.getState();
  const accessToken = getAccessToken(state);
  const language = getAppLanguage(state);
  const languageCode = getLanguageCode(language);

  const headers = {
    'Accept-Language': languageCode,
    ...getAuthorization(accessToken),
  };
  logGraphql(operation);
  operation.setContext({headers});

  return forward(operation);
});

const link = new HttpLink({
  uri: Configs.graphql.GRAPHQL_URL,
});

const client = new ApolloClient({
  link: concat(errorLink, concat(authMiddleware, link)),
  cache: new InMemoryCache(),
});

const WithApollo = WrappedComponent => {
  return (
    <ApolloProvider client={client}>
      <WrappedComponent />
    </ApolloProvider>
  );
};

export default WithApollo;
