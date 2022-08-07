import firebase from "react-native-firebase";
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  AccessToken,
} from "react-native-fbsdk";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import moment from "moment";
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import { GOOGLE_WEB_CLIENT_ID } from "../config";
import I18n from 'app/i18n'
import {typeError} from "../constants/error";
import {languageUSer} from "../i18n";

const auth = firebase.auth();
const store = firebase.firestore();
const storage = firebase.storage();

const configure = async () => {
  try {
    await GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      // language: languageUSer
    });
  } catch (error) {
    throw error;
  }
};

const signUp = async (payload) => {
  const { email, password, device } = payload;

  await auth.createUserWithEmailAndPassword(email, password);
  let { user } = await auth.signInWithEmailAndPassword(email, password);
  await sendEmailVerification();

  // saving user into firestore collection
  let ref = store.collection("users").doc(user.uid);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    ref.set({
      id: user.uid,
      email: email,
      userId: device.userId,
    });
  }

  return user;
};

const sendEmailVerification = async () => {
  auth.languageCode = languageUSer;
  await auth.currentUser.sendEmailVerification();
};

const logIn = async (payload) => {
  let { email, password } = payload;
  let { user } = await auth.signInWithEmailAndPassword(email, password);
  return user;
};

const updateUser = async (payload) => {
  let uid = auth.currentUser.uid;

  // uploading files
  let data = { ...payload };
  data.id = uid;
  delete data.videoPaused;
  if (payload.avatar && payload.avatar.uri) {
    let ref = storage.ref(`/avatar/${uid}`);
    let res = await ref.putFile(payload.avatar.uri, {
      contentType: "image/png",
    });
    data.avatar = res.downloadURL;
  }
  if (payload.featuredVideo && payload.featuredVideo.uri) {
    let ref = storage.ref(`/media/${moment().unix()}`);
    let res = await ref.putFile(payload.featuredVideo.uri, {
      contentType: "video/mp4",
    });
    data.featuredVideo = res.downloadURL;
  }

  let ref = store.collection("users").doc(uid);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    await ref.set(data);
  } else {
    await ref.update(data);
  }
};

const addUserToCommunity = async (payload) => {
  let ref = store.collection("participant_groups").doc("lens_registered_users");
  let snapshot = await ref.get();
  let participant_group = snapshot.data();
  participant_group.participant_list.push({
    ...payload,
    status: true,
  });
  participant_group.number_of_participants += 1;
  await ref.update(participant_group);
};

const getUser = async () => {
  try {
    let ref = store.collection("users").doc(auth.currentUser.uid);
    let snapshot = await ref.get();
    if (snapshot.exists) {
      return snapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (email) => {
  auth.languageCode = languageUSer;
  await auth.sendPasswordResetEmail(email);
};

const logOut = async (provider) => {
  switch (provider) {
    case "facebook":
      LoginManager.logOut();
      break;
    case "google":
      await GoogleSignin.signOut();
      break;
    case "apple":
      await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT,
      });
      break;
    default:
      break;
  }
  await auth.signOut();
};

const signinProcessOfSocial = async (device, userInfo, provider) => {
  const existUserInfo = await getUser();
  if (existUserInfo) {
    if(device && device.userId) {
      existUserInfo.userId = device.userId
      await updateUser(existUserInfo)
    }
    return {
      isNew: false,
      userInfo,
    };
  } else {
    let ref = store.collection("users").doc(auth.currentUser.uid);
    let doc = await ref.get();
    if (!doc.exists) {
      await ref.set({
        id: auth.currentUser.uid,
        email: userInfo.email,
        userId: device.userId,
        provider: provider,
      });
    }
    return {
      isNew: true,
      userInfo,
    };
  }
};

const loginWithGoogle = async (device) => {
  try {
    await GoogleSignin.hasPlayServices();
    const data = await GoogleSignin.signIn();
    let userInfo = {
      id: data.user.id,
      first_name: data.user.givenName,
      last_name: data.user.familyName,
      email: data.user.email,
      photo: data.user.photo,
    };

    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken
    );
    await auth.signInWithCredential(credential);
    
    return await signinProcessOfSocial(device, userInfo, "google");
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw Error(I18n.t('servicesNotAvailable'));
    } else if (error.code === typeError.networkError) {
      throw Error(I18n.t('networkError'));
    } else {
      throw error;
    }
  }
};

const loginWithApple = async (device) => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGIN,
    requestedScopes: [
      AppleAuthRequestScope.EMAIL,
      AppleAuthRequestScope.FULL_NAME,
    ],
  });

  let userInfo = {
    id: appleAuthRequestResponse.user,
    email: appleAuthRequestResponse.email,
    first_name: appleAuthRequestResponse.fullName.givenName,
    last_name: appleAuthRequestResponse.fullName.familyName,
  };

  const { identityToken, nonce } = appleAuthRequestResponse;
  if (identityToken) {
    const appleCredential = firebase.auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );
    const userCredential = await firebase
      .auth()
      .signInWithCredential(appleCredential);

    userInfo.email = userCredential.user.email;
    return await signinProcessOfSocial(device, userInfo, "apple");
  } else {
    // handle this - retry?
  }
};

const getFacebookUserInfo = () =>
  new Promise((resolve, reject) => {
    let options = {
      parameters: {
        fields: {
          string: "first_name, last_name, email, picture.type(large), link",
        },
      },
    };

    let infoRequest = new GraphRequest("/me", options, (error, result) => {

      if (error) {
        return reject(new Error(I18n.t('loginFacebookFailed')));
      }

      let payload = {
        ...result,
      };
      return resolve(payload);
    });

    new GraphRequestManager().addRequest(infoRequest).start();
  });

const loginWithFacebook = async (device) => {
  try {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) {
      return;
    }
    // eslint-disable-next-line max-len
    console.log(
      `FACEBOOK: Login success with permissions: ${result.grantedPermissions.toString()}`
    );

    let userInfo = await getFacebookUserInfo();

    if (userInfo.picture && userInfo.picture.data) {
      userInfo.photo = userInfo.picture.data.url;
    }

    const accessToken = await AccessToken.getCurrentAccessToken();

    const credential = firebase.auth.FacebookAuthProvider.credential(
      accessToken.accessToken
    );

    await auth.signInWithCredential(credential);

    return await signinProcessOfSocial(device, userInfo, "facebook");
  } catch (error) {
    console.log("Error:", error);
  }
};

export default {
  configure,
  signUp,
  logIn,
  logOut,
  getUser,
  updateUser,
  sendEmailVerification,
  forgotPassword,
  loginWithFacebook,
  loginWithGoogle,
  loginWithApple,
  addUserToCommunity,
};
