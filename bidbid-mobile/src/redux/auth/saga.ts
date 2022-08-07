import { call, put, takeLatest } from 'redux-saga/effects';
import {
  ActionTypes,
  ActionSignUp,
  ActionLinkSocial,
  ActionLogin,
  ActionValidateUser,
  ActionLogout,
  ActionSendCodeEmail,
  ActionVerifyEmail,
  ActionChangePhoneNumber,
  ActionVerifyCodeChangePhone,
} from './index';
import * as AuthServices from './service';
import { getUser, saveUser } from '@/redux/user/actions';
import { saveTokenEmail } from '@/redux/auth/actions';

function* signUpPhone(action: ActionSignUp) {
  const { param, onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.signUpPhone, param);
    if (!error && result) {
      onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* login(action: ActionLogin) {
  const { token, provider, code, onSuccess, onFail, isCheckExist } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.login, { code, token, provider, isCheckExist });

    if (!error && result) {
      onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message, error.code);
    }
  } catch (err: any) {
    onFail && onFail(err.message);
  }
}

function* linkSocial(action: ActionLinkSocial) {
  const { onSuccess, onFail, accessToken, type, userId, fromSetting } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.linkSocial, { accessToken, type, userId, fromSetting });
    if (!error && result) {
      if (fromSetting) {
        yield put(getUser({}));
      }
      onSuccess(result ? result.email : '');
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* validateUser(action: ActionValidateUser) {
  const { onSuccess, onFail, phoneNumber } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.validateUser, { phoneNumber });
    if (!error) {
      if (result) {
        yield put(saveUser(result));
        onSuccess(true);
      } else {
        onSuccess(false);
      }
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* logout(action: ActionLogout) {
  const { onSuccess, onFail } = action.payload;
  try {
    yield call(AuthServices.logout);
    onSuccess && onSuccess();
  } catch (err) {
    onFail && onFail(err);
  }
}

function* sendCodeEmail(action: ActionSendCodeEmail) {
  const { onFail, email } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.sendCodeEmail, { email });
    if (!error && result) {
      yield put(saveTokenEmail({ token: result.token }));
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* verifyEmail(action: ActionVerifyEmail) {
  const { onSuccess, onFail, code, token } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.verifyEmail, { code, token });
    if (!error && result) {
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* changePhoneNumber(action: ActionChangePhoneNumber) {
  const { onSuccess, onFail, phoneNumber } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.changePhoneNumber, { phoneNumber });
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* verifyCodeChangePhone(action: ActionVerifyCodeChangePhone) {
  const { onSuccess, onFail, code, token } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.verifyCodeChangePhone, { token, code });
    if (!error && result) {
      yield put(getUser({}));
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.SIGN_UP_PHONE, signUpPhone);
  yield takeLatest(ActionTypes.LOG_OUT, logout);
  yield takeLatest(ActionTypes.LOGIN, login);
  yield takeLatest(ActionTypes.LINK_SOCIAL, linkSocial);
  yield takeLatest(ActionTypes.VALIDATE_USER, validateUser);
  yield takeLatest(ActionTypes.SEND_CODE_EMAIL, sendCodeEmail);
  yield takeLatest(ActionTypes.VERIFY_EMAIL, verifyEmail);
  yield takeLatest(ActionTypes.CHANGE_PHONE_NUMBER, changePhoneNumber);
  yield takeLatest(ActionTypes.VERIFY_CODE_CHANGE_PHONE, verifyCodeChangePhone);
}

export default authSaga;
