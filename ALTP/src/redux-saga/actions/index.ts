import {
  SIGNIN,
  IActionCallback,
  SIGNUP
} from '@/redux-saga/actions/actionTypes'

export function signUp(payload: IActionCallback) {
  return {
    type: SIGNUP,
    payload
  }
}

export function signIn(payload: IActionCallback) {
  return {
    type: SIGNUP,
    payload
  }
}
