import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Config from 'react-native-config';
import { alertError } from '@/shared/alert';
import { RuleSocial } from '@/constants/app';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import NavigationActionsService from '@/navigation/navigation';
import { language } from '@/i18n';

export const appleLogin = async (onLoginSuccess: (token: string, typeLogin: string) => void) => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    onLoginSuccess(appleAuthRequestResponse.identityToken, RuleSocial.Apple);
  } catch (error: any) {
    NavigationActionsService.hideLoading();
    if (error.code !== appleAuth.Error.CANCELED) {
      error && alertError(error.message, language('error'), null);
    }
  }
};

const logOutFacebookIfNeeded = async () => {
  const data = await AccessToken.getCurrentAccessToken();
  if (data && data.accessToken) {
    LoginManager.logOut();
  }
};

export const onLoginFacebook = async (onLoginSuccess: (token: string, typeLogin: string) => void) => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      NavigationActionsService.hideLoading();
      return;
    }

    const accessToken = await AccessToken.getCurrentAccessToken();
    if (accessToken && accessToken.accessToken) {
      // const userInfo = await getFacebookUserInfo();
      onLoginSuccess(accessToken.accessToken, RuleSocial.Facebook);
    }
  } catch (e: any) {
    NavigationActionsService.hideLoading();
    await logOutFacebookIfNeeded();
    alertError(e?.message ?? '', language('error'), null);
  }
};

// const getFacebookUserInfo: () => Promise<any> = () =>
//   new Promise((resolve, reject) => {
//     const options = {
//       parameters: {
//         fields: {
//           string: 'first_name, last_name, email, picture.type(large), link,name, friends, gender, birthday',
//         },
//       },
//     };
//
//     const infoRequest = new GraphRequest('/me', options, (error, result) => {
//       if (error) {
//         return reject(new Error('error'));
//       }
//
//       const payload = {
//         ...result,
//       };
//       return resolve(payload);
//     });
//     new GraphRequestManager().addRequest(infoRequest).start();
//   });

export const googleLogin = async (onLoginSuccess: (token: string, typeLogin: string) => void) => {
  try {
    GoogleSignin.configure({ webClientId: Config.FirebaseWebClientId });
    const data = await GoogleSignin.signIn();
    await GoogleSignin.clearCachedAccessToken(data.idToken ?? '');
    const tokens = await GoogleSignin.getTokens();
    onLoginSuccess(tokens ? tokens.idToken : '', RuleSocial.Google);
    await GoogleSignin.revokeAccess();
    await GoogleSignin?.signOut();
  } catch (error) {
    NavigationActionsService.hideLoading();
    await logOutGoogleIfNeeded();
  }
};

export const logOutGoogleIfNeeded = async () => {
  const isSignedIn = await GoogleSignin.isSignedIn();
  if (isSignedIn) {
    await GoogleSignin.revokeAccess();
    await GoogleSignin?.signOut();
  }
  await logOutFaceBook();
};

const logOutFaceBook = async () => {
  const data = await AccessToken.getCurrentAccessToken();
  if (data && data.accessToken) {
    LoginManager.logOut();
  }
};
