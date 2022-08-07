/* eslint-disable no-unused-vars */
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const TOKEN_SECRET_KEY = 'TOKEN_SECRET_KEY';
// const faker = require('faker');
const logService = require('../utils/logService');
// const querystring = require('querystring');

const endPoints = {
  //sign up flow
  signUp: '/register', //create account and retrieve the access tokens in exchange of email/password
  confirmOtp: '/confirm-phone-verification-token', //Verify account
  postMobilePhone: '/send-phone-verification-token',

  //login flow
  token: '/token',
  refresh: '/refresh',
  logout: '/logout',

  //forgot password flow
  forgotPassword: '/forgot-password-send-phone-verification-token',
  forgotPasswordConfirmOtp: '/phone-confirm-return-object',
  resetPassword: '/reset-password',
};

const fakeToken = () => {
  const token = jwt.sign({userId: 'testId'}, TOKEN_SECRET_KEY);
  return token;
};
const userAgentName = 'agent';
const userFirstLoginName = 'user1';
const userNormalName = 'user';
let currentUserName = userAgentName;
const userIdFirstLogin =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1ODI1MTc5ODIsImV4cCI6MTU4Mjg3NjAxOSwiaXNzIjoiaHR0cDovL2lkLmRldi50b3BlbmxhbmQuY29tIiwiYXVkIjpbImFzc2V0IiwiY29tbXVuaWNhdGlvbiIsImNvbnRlbnQiLCJncmFwaHFsLWdhdGV3YXkiLCJtYXN0ZXItZGF0YSIsIm1hdGNoaW5nLXJ1bGVzIiwicGVyc29uYWwiLCJwb3N0Iiwic2FsZSIsInN1cHBvcnQtcmVxdWVzdCIsInRyYW5zYWN0aW9uIl0sImNsaWVudF9pZCI6InRvcGVubGFuZC1tb2JpbGUiLCJzdWIiOiI4Mzc1Njc2My1kOTI3LTQ2ZjctOWVkZS03YWNmYzgyMWMzZDgiLCJhdXRoX3RpbWUiOjE1ODI1MTc5ODIsImlkcCI6ImxvY2FsIiwiaXNBZ2VudCI6ZmFsc2UsImlzRmlyc3RMb2dpbiI6dHJ1ZSwic2NvcGUiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIiwiYXNzZXQiLCJjb21tdW5pY2F0aW9uIiwiY29udGVudCIsImdyYXBocWwtZ2F0ZXdheSIsIm1hc3Rlci1kYXRhIiwibWF0Y2hpbmctcnVsZXMiLCJwZXJzb25hbCIsInBvc3QiLCJzYWxlIiwic3VwcG9ydC1yZXF1ZXN0IiwidHJhbnNhY3Rpb24iXSwiYW1yIjpbInB3ZCJdLCJqdGkiOiJhNWIxNGExMy0yOTJlLTRhNmUtYTE5ZS0yY2Q4NTU1MjdkMjIiLCJpYXQiOjE1ODI4NjMxODV9.nZnesGeEBpHUhnFlo--Fet8QF9oiHaYhrn8FtpFKahQ';
const agentIdToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1ODI1MTc5ODIsImV4cCI6MTU4Mjg2Njc4NSwiaXNzIjoiaHR0cDovL2lkLmRldi50b3BlbmxhbmQuY29tIiwiYXVkIjpbImFzc2V0IiwiY29tbXVuaWNhdGlvbiIsImNvbnRlbnQiLCJncmFwaHFsLWdhdGV3YXkiLCJtYXN0ZXItZGF0YSIsIm1hdGNoaW5nLXJ1bGVzIiwicGVyc29uYWwiLCJwb3N0Iiwic2FsZSIsInN1cHBvcnQtcmVxdWVzdCIsInRyYW5zYWN0aW9uIl0sImNsaWVudF9pZCI6InRvcGVubGFuZC1tb2JpbGUiLCJzdWIiOiI4Mzc1Njc2My1kOTI3LTQ2ZjctOWVkZS03YWNmYzgyMWMzZDgiLCJhdXRoX3RpbWUiOjE1ODI1MTc5ODIsImlkcCI6ImxvY2FsIiwiaXNBZ2VudCI6dHJ1ZSwic2NvcGUiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIiwiYXNzZXQiLCJjb21tdW5pY2F0aW9uIiwiY29udGVudCIsImdyYXBocWwtZ2F0ZXdheSIsIm1hc3Rlci1kYXRhIiwibWF0Y2hpbmctcnVsZXMiLCJwZXJzb25hbCIsInBvc3QiLCJzYWxlIiwic3VwcG9ydC1yZXF1ZXN0IiwidHJhbnNhY3Rpb24iXSwiYW1yIjpbInB3ZCJdLCJqdGkiOiJhNWIxNGExMy0yOTJlLTRhNmUtYTE5ZS0yY2Q4NTU1MjdkMjIiLCJpYXQiOjE1ODI4NjMxODV9.6yqJbgLUeB8OMZJYXYycxatYGjOjjEEzEn6OPlsoLjU';
const userIdToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6InZ4NkN2UV85V2RaTmpaUm1lUVpyUEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODI1MTc5ODIsImV4cCI6MTU4MjUyMTU4MiwiaXNzIjoiaHR0cDovL2lkLmRldi50b3BlbmxhbmQuY29tIiwiYXVkIjpbImFzc2V0IiwiY29tbXVuaWNhdGlvbiIsImNvbnRlbnQiLCJncmFwaHFsLWdhdGV3YXkiLCJtYXN0ZXItZGF0YSIsIm1hdGNoaW5nLXJ1bGVzIiwicGVyc29uYWwiLCJwb3N0Iiwic2FsZSIsInN1cHBvcnQtcmVxdWVzdCIsInRyYW5zYWN0aW9uIl0sImNsaWVudF9pZCI6InRvcGVubGFuZC1tb2JpbGUiLCJzdWIiOiI4Mzc1Njc2My1kOTI3LTQ2ZjctOWVkZS03YWNmYzgyMWMzZDgiLCJhdXRoX3RpbWUiOjE1ODI1MTc5ODIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIiwiYXNzZXQiLCJjb21tdW5pY2F0aW9uIiwiY29udGVudCIsImdyYXBocWwtZ2F0ZXdheSIsIm1hc3Rlci1kYXRhIiwibWF0Y2hpbmctcnVsZXMiLCJwZXJzb25hbCIsInBvc3QiLCJzYWxlIiwic3VwcG9ydC1yZXF1ZXN0IiwidHJhbnNhY3Rpb24iXSwiYW1yIjpbInB3ZCJdfQ.HCUpDkC44XmUXXYqxvB8v33_NYY4NWMGtlky00DaaJQP_5YvMzAINNC5qBhaWhU3WDky0C0CiTCxCrPqXbjkZubW-E9ao8GhuXTGCnonbD_KFxsw8yBwj1ctMGvNNBrMCIHwBB-vjS8tscOolaHTXoaUFgTWPZGQCybSBMgWOyrUUqMPt9SWU5HAlLmqACkAz9nRtYFM1Byj0-e11uNcKDIzOyJbOl5NafbHjjbdpPv1TnmLa5pvdWvDfSti6yWzrZxJi_H7RZLTvjD9VTN5g70nJrNCS55FrHDGBfBeevL2U3wTMiZjzBPY8FSQtbmLetHxkPk0qZcuJMl33zN1ww';

const getTokenId = () => {
  switch (currentUserName) {
    case userFirstLoginName:
      return userIdFirstLogin;
    case userAgentName:
      return agentIdToken;
    default:
      return userIdToken;
  }
};

const responseSuccess = (res, data) => {
  logService.log(data);

  res.send(data);
};

const responseFailure = (res, data) => {
  logService.log(data);
  res.status(400).send(data);
};

router.post('/send-phone-verification-token', async (req, res) => {
  try {
    const response = {message: 'success'};
    responseSuccess(res, response);
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/register', async (req, res) => {
  try {
    currentUserName = userFirstLoginName;
    const token = fakeToken();
    const expiredTime = Date.now();
    const response = {token, expiredTime: expiredTime, firstLogin: true};
    logService.log('body: ', req.body);
    responseSuccess(res, response);
    //responseFailure(res, {error: 'error_code', error_description: 'WRONG_REQUEST2'});
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/confirm-phone-verification-token', async (req, res) => {
  try {
    const otpToken = fakeToken();
    const response = {message: 'OTP_CONFIRMED', token: otpToken};
    logService.log('confirmSignUp req.body: ', req.body);
    const otp = req.body.Code;
    otp === '123456'
      ? responseSuccess(res, response)
      : responseFailure(res, {error: 'error_code', error_description: 'Mã OTP không trùng khớp'});
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/token', async (req, res) => {
  try {
    const response = {
      access_token:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6InZ4NkN2UV85V2RaTmpaUmkN2UV85V2RaTmpaUm1lUVpyUEEiLCJiOjE1ODI1MTc5ODIsImV4cCI6MTU4MjUyMTU4MiwiaXNzIjoiaHR0cDovL2lkLmRldi50b3BlbmxhbmQuY29tIiwiYXVkIjpbImFzc2V0IiwiY29tbXVuaWNhdGlvbiIsImNvbnRlbnQiLCJncmFwaHFsLWdhdGV3YXkiLCJtYXN0ZXItZGF0YSIsIm1hdGNoaW5nLXJ1bGVzIiwicGVyc29uYWwiLCJwb3N0Iiwic2FsZSIsInN1cHBvcnQtcmVxdWVzdCIsInRyYW5zYWN0aW9uIl0sImNsaWVudF9pZCI6InRvcGVubGFuZC1tb2JpbGUiLCJzdWIiOiI4Mzc1Njc2My1kOTI3LTQ2ZjctOWVkZS03YWNmYzgyMWMzZDgiLCJhdXRoX3RpbWUiOjE1ODI1MTc5ODIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIiwiYXNzZXQiLCJjb21tdW5pY2F0aW9uIiwiY29udGVudCIsImdyYXBocWwtZ2F0ZXdheSIsIm1hc3Rlci1kYXRhIiwibWF0Y2hpbmctcnVsZXMiLCJwZXJzb25hbCIsInBvc3QiLCJzYWxlIiwic3VwcG9ydC1yZXF1ZXN0IiwidHJhbnNhY3Rpb24iXSwiYW1yIjpbInB3ZCJdfQ.HCUpDkC44XmUXXYqxvB8v33_NYY4NWMGtlky00DaaJQP_5YvMzAINNC5qBhaWhU3WDky0C0CiTCxCrPqXbjkZubW-E9ao8GhuXTGCnonbD_KFxsw8yBwj1ctMGvNNBrMCIHwBB-vjS8tscOolaHTXoaUFgTWPZGQCybSBMgWOyrUUqMPt9SWU5HAlLmqACkAz9nRtYFM1Byj0-e11uNcKDIzOyJbOl5NafbHjjbdpPv1TnmLa5pvdWvDfSti6yWzrZxJi_H7RZLTvjD9VTN5g70nJrNCS55FrHDGBfBeevL2U3wTMiZjzBPY8FSQtbmLetHxkPk0qZcuJMl33zN1ww',
      expires_in: 3600,
      refresh_token: 'kN2UV85V2RaTmpaUm1lUVpyUEEiLCJ',
      token_type: 'Bearer',
      scope:
        'asset communication content email graphql-gateway master-data matching-rules openid personal post profile sale support-request transaction',
    };
    responseSuccess(res, response);
    // responseFailure(res, {error: 'invalid_grant', error_description: 'Invalid grants'});
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const idToken = getTokenId();
    const response = {
      access_token:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6InZ4NkN2UV85V2RaTmpaUm1lUVpyUEEiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODI1MTc5ODIsImV4cCI6MTU4MjUyMTU4MiwiaXNzIjoiaHR0cDovL2lkLmRldi50b3BlbmxhbmQuY29tIiwiYXVkIjpbImFzc2V0IiwiY29tbXVuaWNhdGlvbiIsImNvbnRlbnQiLCJncmFwaHFsLWdhdGV3YXkiLCJtYXN0ZXItZGF0YSIsIm1hdGNoaW5nLXJ1bGVzIiwicGVyc29uYWwiLCJwb3N0Iiwic2FsZSIsInN1cHBvcnQtcmVxdWVzdCIsInRyYW5zYWN0aW9uIl0sImNsaWVudF9pZCI6InRvcGVubGFuZC1tb2JpbGUiLCJzdWIiOiI4Mzc1Njc2My1kOTI3LTQ2ZjctOWVkZS03YWNmYzgyMWMzZDgiLCJhdXRoX3RpbWUiOjE1ODI1MTc5ODIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIiwiYXNzZXQiLCJjb21tdW5pY2F0aW9uIiwiY29udGVudCIsImdyYXBocWwtZ2F0ZXdheSIsIm1hc3Rlci1kYXRhIiwibWF0Y2hpbmctcnVsZXMiLCJwZXJzb25hbCIsInBvc3QiLCJzYWxlIiwic3VwcG9ydC1yZXF1ZXN0IiwidHJhbnNhY3Rpb24iXSwiYW1yIjpbInB3ZCJdfQ.HCUpDkC44XmUXXYqxvB8v33_NYY4NWMGtlky00DaaJQP_5YvMzAINNC5qBhaWhU3WDky0C0CiTCxCrPqXbjkZubW-E9ao8GhuXTGCnonbD_KFxsw8yBwj1ctMGvNNBrMCIHwBB-vjS8tscOolaHTXoaUFgTWPZGQCybSBMgWOyrUUqMPt9SWU5HAlLmqACkAz9nRtYFM1Byj0-e11uNcKDIzOyJbOl5NafbHjjbdpPv1TnmLa5pvdWvDfSti6yWzrZxJi_H7RZLTvjD9VTN5g70nJrNCS55FrHDGBfBeevL2U3wTMiZjzBPY8FSQtbmLetHxkPk0qZcuJMl33zN1ww',
      expires_in: 3600,
      idToken: idToken,
      refresh_token: 'kN2UV85V2RaTmpaUm1lUVpyUEEiLCJ',
      token_type: 'Bearer',
      scope:
        'asset communication content email graphql-gateway master-data matching-rules openid personal post profile sale support-request transaction',
    };
    responseSuccess(res, response);
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/logout', async (req, res) => {
  try {
    responseSuccess(res, {});
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

//Forgot password flow:
const fakeErrorForgotPasswordFlow = {
  value: {
    message: null,
    errors: [
      {
        code: 'PasswordMismatch',
        message: 'Falsches Passwort',
      },
    ],
  },
  formatters: [],
  contentTypes: [],
  declaredType: null,
  statusCode: 401,
};

router.post('/ForgotPasswordSendPhoneVerificationToken', async (req, res) => {
  try {
    responseSuccess(res, {});
    // responseFailure(res, fakeErrorForgotPasswordFlow);
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/phoneconfirmreturnobject', async (req, res) => {
  try {
    responseSuccess(res, {username: 'hoa'});
    // responseFailure(res, fakeErrorForgotPasswordFlow);
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

router.post('/changepasswordasync', async (req, res) => {
  try {
    responseSuccess(res, {});
    // responseFailure(res, fakeErrorForgotPasswordFlow);
  } catch (err) {
    return res.status(422).send({error: 'error_code', error_description: err.message});
  }
});

module.exports = router;
