import { call } from 'redux-saga/effects';

export function callApi(func, ...param) {
  return call(func, ...param);
}
